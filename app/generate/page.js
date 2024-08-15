'use client'

import { useUser } from "@clerk/nextjs"
import {db} from '@/firebase'
import { collection, getDoc, writeBatch, doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Container, Box , Typography, Paper, TextField, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress} from "@mui/material"

 //

// Client Components: 
// Use "use client" when your component needs to be 
    // interactive or relies on client-side features.
// Server Components: 
// Keep components server-rendered by default for better 
// performance and simpler code when client-side interactivity isn’t needed.

export default function Generate(){
    // destructuring user-related data form the useUser hook
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    // State to manage which flashcards are flipped (front or back view), 
    // an object where each key represents a flashcard ID and the value is true/false   
    const [flipped, setFlipped] = useState([])
    // State to store the text input from the user, this will be sent to the API to generate flashcards
    const [text, setText] = useState('')
    // State to store the name of the flashcard collection, 
    const [name, setName] = useState('')
    // State to manage the open/close status of the dialog (modal) 
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false);

    const router = useRouter()


    // Redirect to sign-in page if not signed in
    if (!isSignedIn && isLoaded) {
        router.push('/sign-in'); // Redirect to your sign-in page
        return null; // Render nothing while redirecting
    }

    // This function is called when the user submits text to generate flashcards.
    // It sends a POST request to the api/generate endpoint with the text as the body and updates the flashcards state with the response data.
    const handleSubmit = async () => {
        await setLoading(true)
        // console.log(text)
        try{
            fetch('api/generate', {
                method: 'POST',
                body: text,
            })
            .then((res) => res.json())
            .then((data) => setFlashcards(data))
            .then(() => setLoading(false))
            // await setLoading(false)
            // console.log(flashcards)
        } catch (error){
            console.log('error')
        } 
        // setLoading(false)
    }
    // This function handles the flipping of flashcards when they are clicked. 
    const handlecardClick = (id) => {
        setFlipped((prev) => ({
            //This creates a new object that contains all the properties of the prev state. It effectively clones the previous state.
            ...prev, 
            // Flip the state (true/false) of the targeted flashcard by its ID
            [id]: !prev[id],
        }))
    }
    //handleOpen and handleClose manage the open state of the dialog that prompts the user to save the flashcard collection.
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    // Function to save the generated flashcards to Firestore
    const saveFlashcards = async () => {
        // Ensure the user has entered a name for the flashcard collection
        if (!name){
            alert('please enter a name')
            return 
        }

        // Initialize a Firestore batch operation to group multiple writes as a single transaction
        const batch = writeBatch(db);
        // Create a reference to the user's document within the 'users' collection
       

        // collection(db, 'users'): This specifies a collection in your Firestore database named 'users'. A collection in Firestore is like a table in a relational database.
        // doc(collection(db, 'users'), user.id): This creates a reference to a specific document within the 'users' collection. The document ID is user.id, which is likely the unique identifier for the currently logged-in user. This reference allows you to interact with that specific document.    
        // acessing main document called users 
        const userDocRef = doc(collection(db, 'users'), user.id);
        // getDoc(userDocRef): This fetches the document from Firestore corresponding to the userDocRef reference. 
        // It returns a DocumentSnapshot object, which contains the document data if it exists.        
        const docSnap = await getDoc(userDocRef);

        // Checking if the user document already exists
        if(docSnap.exists()){

            // Retrieving the user's existing flashcard collections
            const collections = docSnap.data().flashcards || []
            // checking if a flashcard collection with the same name already exist
            if (collections.find((f) => f.name == name)){
                alert('Flashcard colection with the same name exist')
                return
            }
            else{
                // Adding the new collection name to the user's flashcards
                collections.push({name})
                // Updating the user document with the new flashcard collection
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else{
            // creating a new user document with the flash card collection, name of flash card collection 
            batch.set(userDocRef, {flashcards: [{name}]})
        }
        // collection for the cards itself -> refernce to subcollection of the unique user
        const colRef = collection(userDocRef, name)
        
        flashcards.forEach((flashcard) => {
            // Create a reference to a new document in the flashcards collection
            // colRef is a reference to the flashcards collection in Firestore
            // doc(colRef) creates a new document with an auto-generated ID
            const cardDocRef = doc(colRef)

            // Add the flashcard to the batch operation
            // batch.set() queues the operation to set the flashcard data in the new document
            // we use batch to right all at once
            batch.set(cardDocRef, flashcard)

            // Reference Creation: You create a reference (colRef) to the subcollection where the flashcards will be stored.
            // Saving Flashcards: You then use this reference to save each flashcard as a separate document within that subcollection.
        }   )
        // Commit the batch operation, writing all queued flashcards to Firestore in one atomic operation
        // This ensures that all flashcards are added to the database at once, maintaining data integrity
        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (

        <Container>
            <Box sx={{
                mt:4, mb:6, display: 'flex', flexDirection: 'column', alignItems:'center'
            }}> 

                <Typography variant="h4"> Generate Flashcards </Typography>
                <Paper sx={{p:4, width: '100%'}}>
                    <TextField value = {text}
                    onChange={(e) => setText(e.target.value)}
                    label="enter text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                        mb:2,
                    }}
                    />
                    <Button 
                    variant = "contained"
                    color='primary'
                    onClick={handleSubmit}
                    fullWidth
                    >
                        {' '}
                        Submit
                    </Button>
                </Paper>
            </Box>


            { loading ? (<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress /> {/* Loading Spinner */}
                        <Typography variant="h6" sx={{ ml: 2 }}>Loading flashcards...</Typography>
                    </Box>) :
                
            
                    flashcards.length > 0 && (
                        <Box sx = {{my:4}}>

                        <Typography variant= "h5"> Flashcards preview</Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                            
                                <Grid item xs={12} sm={6} md={4} key={index}>   
                                
                                    <Card>
                                        <CardActionArea onClick={() => {handlecardClick(index)}}>

                                            <CardContent>
                                                <Box
                                                    sx={{
                                                        perspective: '1000px', // Creates the 3D space for the flip effect
                                                        position: 'relative', // Positions the box relative to its container
                                                        width: '100%',
                                                        height: '200px',
                                                        '& > div': {
                                                            transition: 'transform 0.6s', // Smooth transition for the flip
                                                            transformStyle: 'preserve-3d', // Allows 3D transformation
                                                            position: 'absolute', // Position each side absolutely within the Box
                                                            width: '100%',
                                                            height: '100%',
                                                            backfaceVisibility: 'hidden', // Hides the back side when not facing the user
                                                            display: 'flex', // Flexbox to center content
                                                            justifyContent: 'center', // Center content horizontally
                                                            alignItems: 'center', // Center content vertically
                                                            textAlign: 'center', // Center the text
                                                            padding: '2', // Add padding if needed
                                                            boxSizing: 'border-box',
                                                        },
                                                        '& > div:nth-of-type(1)': {
                                                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                        },
                                                        '& > div:nth-of-type(2)': {
                                                            transform: flipped[index] ? 'rotateY(0deg)' : 'rotateY(180deg)',
                                                        },
                                                    }}
                                                    
                                                > 
                                                    <div>
                                                        <div>
                                                            <Typography variant='h5' component="div">
                                                                {flashcard.front}
                                                            </Typography>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div>
                                                            <Typography variant='h5' component="div">
                                                                {flashcard.back}
                                                            </Typography>
                                                        </div>
                                                    </div>

                                                </Box>

                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                            <Box sx={{ mt:4, display:'flex', justifyContent:'center' }}> 
                                <Button variant="contained" colors='secondary' onClick={handleOpen}> Save </Button>
                            </Box>
                        </Box>
                    )
                

            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle> Save Flashcards </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcard collection
                    </DialogContentText>
                    <TextField 
                        autoFocus 
                        margin='dense' 
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}> Cancel </Button>
                    <Button onClick={saveFlashcards}> Save </Button>

                </DialogActions>
            </Dialog>

        </Container>

        
    )
    
}

