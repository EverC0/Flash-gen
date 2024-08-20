'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid, Divider } from "@mui/material";
import { SignedIn, SignedOut, UserButton , useUser} from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from 'next/navigation';
// import { useEffect } from "react";


export default function Home() {
  const router = useRouter()
  const {isLoaded, isSignedIn, user} = useUser()


  const handleNav = (e) => {
    router.push(e)
  }

  const handleSubmit = async () =>{

  if (!isSignedIn && isLoaded) {
      return handleNav('/sign-up'); // Render nothing while redirecting
  }

    const checkoutSession = await fetch('api/checkout_session', {

        method: 'POST',
        headers:{
          origin: window.location.origin
        },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error){
      console.warn(error.message)
    }
  } 

  return (

    <>

    <Head>
        <title>Flashcard Saas</title>
        <meta name="description" content="create flashcard from your text"/>
      </Head>

    <Container maxWidth='lg' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection:'column' }}>

      <Box 
        sx={{
          textAlign:'center',
          my:4,
          mx:'auto',

        }}>
        <Typography variant = "h2" gutterBottom>Welcome to myFlash ai</Typography>
        <Typography variant = "h5" gutterBottom>
          {' '}
          The easist way to make a flashcards from your text
          </Typography>
          <Button variant="contained" color='primary' sx={{mt:2}} onClick={()=> handleNav('/generate')}> Get Started</Button>
      </Box>

      <Box sx={{my: 6}}>
        <Typography 
          variant='h4' 
          component='h2' 
          textAlign={'center'} 
          margin={3} 
          color='inherit'
          gutterBottom
          >
          Feature
        </Typography>
          <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={4} sx={{alignItems:'stretch', }}>

                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',  padding:2 }}>
                  <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom >Smart Flashcard</Typography>
                  <Typography sx={{ textAlign: 'center' }}>
                    Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ position: 'absolute', right: '-2px', top: 0, height: '100%', borderRightWidth:'3px' }} />
                </Grid>

                  <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding:2 }}> 
                    <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom> Easy text Input </Typography>
                    <Typography> 
                      Simply input your text and let our software do the rest. Creating falshcards has never been easier
                    </Typography>
                    <Divider orientation="vertical" flexItem sx={{ position: 'absolute', right: '-2px', top: 0, height: '100%', borderRightWidth:'3px', padding: 2 }} />
                  </Grid>

                  <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', }}> 
                    <Typography variant="h6" sx={{textAlign:'center'}} gutterBottom> Accessible anywhere</Typography>
                    <Typography> Access your flashcards from any device, at any time, study anywhere.
                    </Typography>
                  </Grid>
                </Grid>
            </Box>
      </Box>

      <Box sx={{my:6, textAlign: 'center' }}>
        <Typography variant='h4' margin={5}> Pricing</Typography>

        <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={4} sx={{alignItems:'stretch' }}>

                <Grid item xs={12} md={6} 
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',  padding:2 }}>

                    <Box
                        sx={{
                          p: 3,
                          border: '1px solid',
                          borderColor: 'grey.300',
                          height:'100%',
                          borderRadius: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}>
                          
                        <Typography variant="h5" sx={{ textAlign: 'center' }} gutterBottom>Basic</Typography>
                        {/* <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom>$5 / month</Typography> */}
                        <Typography variant="h6"  gutterBottom>
                            Limited Flashcard Creation
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Users can create and store up to <strong>8 flashcards</strong> per session. This limitation encourages users to upgrade to the paid plan for unlimited flashcard creation.
                        </Typography>

            
                       

                        {/* <Button variant="contained" color='primary' sx={{mt:1, width:'10rem', alignSelf:'center'}}> 
                          Choose Basic
                        </Button> */}
                    </Box>

                  {/* <Divider orientation="vertical" flexItem sx={{ position: 'absolute', right: '-2px', top: 0, height: '100%', borderRightWidth:'3px' }} /> */}

                </Grid>

                  <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding:2 }}> 
                    
                      <Box
                        sx={{
                          p: 3,
                          border: '1px solid',
                          borderColor: 'grey.300',
                          height:'100%',
                          borderRadius: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}>
                          
                        <Typography variant="h5" sx={{ textAlign: 'center' }} gutterBottom>Pro</Typography>
                        <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom>$10 / month</Typography>

                        <Typography sx={{ textAlign: 'center', flexGrow: 1 }} >
                          Unlimited flashcards and storage, with priority support.
                        </Typography>
                        <Button 
                          variant="contained"  
                          color='primary' 
                          sx={{mt:1, width:'10rem', alignSelf:'center'}} 
                          onClick={handleSubmit}> 
                          Choose Pro
                        </Button>
                      </Box>
                    {/* <Divider orientation="vertical" flexItem sx={{ position: 'absolute', right: '-2px', top: 0, height: '100%', borderRightWidth:'3px', padding: 2 }} /> */}
                  
                  </Grid>

                  
                </Grid>
            </Box>
      </Box>


    </Container>

    </>
    
  )
}
