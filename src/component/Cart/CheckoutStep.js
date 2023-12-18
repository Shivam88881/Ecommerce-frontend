import React from 'react';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Typography } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import '../styles/_checkoutSteps.scss';

function CheckoutStep({ activeStep }) {
    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,
            icon: <LocalShippingIcon />
        },
        {
            label: <Typography>Confirm Order</Typography>,
            icon: <LibraryAddCheckIcon />
        },
        {
            label: <Typography>Payment</Typography>,
            icon: <AccountBalanceIcon />
        }
    ]
    return (
        <>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step,index) => (
                    <Step key={index} active={activeStep === index ? true : false} completed={activeStep >= index ? true : false}>
                        <StepLabel icon={step.icon} style={{color: activeStep >=index ? "tomato":"rgba(0,0,0,0.649)"}}>{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </>
    )
}

export default CheckoutStep
