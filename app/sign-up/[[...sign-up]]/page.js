import { SignIn, SignUp } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function SignupPage(){

    return (

    <>

        <Container maxWidth='100vw'>


            <Box
                display="flex"
                flexDirection="column"
                alignItems= "center"
                justifyContent="center"
                >

                <Typography variant="h4"> Sign Up </Typography>
                <SignUp/>
            </Box>



        </Container>
        </>
    )
}