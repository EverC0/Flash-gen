'use client'


import {useUser} from '@clerk/nextjs'
import {db} from '@/firebase'
import { useEffect, useState } from 'react'
import { Container, Box , Typography, Paper, TextField, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material"

import { useSearchParams } from 'next/navigation'
import { collection, doc, getDocs, docRef } from 'firebase/firestore'

export default function Flashcard(){

    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {

        async function getFlashcard() {
            if(!search || !user) return
            // get all docs in collection ref
            const colRef = collection( doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data()})
                
            });

            setFlashcards(flashcards)

        }
        getFlashcard()
    }, [user, search])


    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            //This creates a new object that contains all the properties of the prev state. It effectively clones the previous state.
            ...prev, 
            // Flip the state (true/false) of the targeted flashcard by its ID
            [id]: !prev[id],
        }))
    }

    if(!isLoaded || !isSignedIn){
        return <></>
    }

    return(

        <Container maxWidth="100vw">

            <Typography variant='h4' sx={{display:'flex', justifyContent:'center', alignItems:'center', mt:3}}> {search.toLocaleUpperCase()}</Typography>

            <Grid container spacing={3} sx={{mt: 4}}>

                        {flashcards.map((flashcard, index) => (
                        
                            <Grid item xs={12} sm={6} md={4} key={index}>   
                            
                                <Card>
                                    <CardActionArea onClick={() => {handleCardClick(index)}}>

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
        </Container>

    )

}