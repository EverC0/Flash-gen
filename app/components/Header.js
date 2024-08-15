"use client" 

import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";


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
          <Typography variant="h6" style={{flexGrow: 1}}> 
            Flashcard Saas 
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