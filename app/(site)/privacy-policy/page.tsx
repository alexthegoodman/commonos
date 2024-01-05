"use client";

import { Box, Typography, styled } from "@mui/material";

const InnerWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "25px 0",
}));

export default function PrivacyPolicy() {
  return (
    <InnerWrapper>
      <Typography whiteSpace="pre-line">{`Privacy Policy for CommonOS

  Introduction
  
  The purpose of this privacy policy is to inform users about the collection, use, and retention of their personal information while using our platform, CommonOS. Our policy applies to all users and visitors of our platform and outlines the measures we take to protect the privacy and security of their data.
  
  Data Collection
  
  We collect the following types of information from users:
  
  - Personal information provided during account creation and profile setup
  - Emails and communication with our customer support team
  - Usage analytics such as device information, browser type, and page views
  - Cookies and tracking technologies to monitor user interactions with our platform
  - User-generated content such as prompts and files
  
  Use of Data
  
  We use the collected data for the following purposes:
  
  - To personalize user experience and provide targeted content and recommendations
  - To improve our platform's functionality and features based on user feedback and usage patterns
  - To communicate important updates, offers, and promotions to users
  - To enhance the security and integrity of our platform and prevent fraudulent activities
  
  Data Retention
  
  We will retain user data for an indefinite period or until the user requests its deletion. We may also retain and use data as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
  
  Data Security
  
  We take the following measures to ensure the security of user data:
  
  - Bcrypt password encryption to protect user account credentials
  - Secure socket layer (SSL) technology to secure data transmission over the internet
  - Strict access controls and authentication mechanisms to prevent unauthorized access
  - Use of a secure payment processor, Stripe, for any financial transactions
  
  Conclusion
  
  By using CommonOS, you agree to the terms outlined in this privacy policy. We are committed to respecting and safeguarding the privacy of our users and continuously improving our data protection practices. If you have any concerns or questions about our privacy policy, please contact our customer support team for assistance.
  `}</Typography>
    </InnerWrapper>
  );
}
