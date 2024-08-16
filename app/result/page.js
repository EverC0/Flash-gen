'use client'
import { clerkClient, useUser } from '@clerk/nextjs';
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {getStripe} from "@/utils/get-stripe"
import { useSearchParams } from "next/navigation"
import { Container, Typography, Box, CircularProgress } from "@mui/material"


const ResultPage = () => {
    
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const { user } = useUser(); // Get user data

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() =>{
        const fetchCheckoutSession = async () =>{
            if(!session_id) return

            try{
                const res = await fetch(
                    `/api/checkout_session?session_id=${session_id}`)
                const sessionData = await res.json()
                if(res.ok){
                    setSession(sessionData);
                    if (sessionData.payment_status === "paid") {
                        await clerkClient.users.updateUser(user.id, {
                            publicMetadata: {
                                isPaidUser: true,
                            },
                        });
                    }

                    
                }else{
                    setError(sessionData.error)
                }
            } catch(err){
                setError("an error occured")
            }
            finally{
                setLoading(false)
            }
        }
        fetchCheckoutSession()
    }, [session_id])

    if(loading){
        return(
            <Container 
            maxWidth= "100vw"
            sx={{
                textAlign:'center',
                mt:4                
            }}>
            <CircularProgress/>
            <Typography variant="h6"> Loading...</Typography>
            </Container>

        )
    }

    if(error){

        return(
            <Container 
            maxWidth= "100vw"
            sx={{
                textAlign:'center',
                mt:4                
            }}>
            
            <Typography variant="h6">(error)
                
            </Typography>

            </Container>

        )

    }

    return(
        <Container 
        maxWidth= "100vw"
        sx={{
            textAlign:'center',
            mt:4                
        }}>

        {
        session.payment_status === "paid" ? (
            <>
            <Typography variant = 'h4'> Thank you for puchasing. </Typography>
            <Box sx={{mt:22}}> 
                <Typography variant="h6"> Session ID: {session_id}</Typography>
                <Typography variant="body1">
                    We have recieved your payment, you will recieve an email with the order details shortly.
                </Typography>
            </Box>
            </>
        
        ) : ( <>
            <Typography variant = 'h4'> Payment failed </Typography>
            <Box sx={{mt:22}}> 
                <Typography variant="body1">
                    Your payment was not succesful.
                </Typography>
            </Box>
            </>)
        }

        </Container>

    )

}

export default ResultPage