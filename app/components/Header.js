"use client" 

import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
// import '/Users/evercampos/Flash-Card/styles';



const Header = () => {
    const router = useRouter();

    const handleNavigation = (path) => {
      console.log(`Navigating to ${path}`);
      router.push(path);
    };

    const buttonStyles = {
      color: 'white', // Set the text color
      bgcolor: 'blue', // Set the background color
      '&:hover': {
        bgcolor: 'darkblue', // Change background color on hover
      },
    };
  
    return (
        <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" fontFamily='inherit' style={{flexGrow: 1, }}> 
        myFlash
            </Typography>

            <Button color='inherit' onClick={() => handleNavigation('/')}>
                Home
            </Button>

          <SignedOut>
            <Button color='inherit' onClick={() => handleNavigation("/sign-in")}> Login </Button>
            <Button color='inherit' onClick={() => handleNavigation("/sign-up")}> Sign up </Button>
          </SignedOut>

          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>

      </AppBar>
    );
    
}

export default Header;