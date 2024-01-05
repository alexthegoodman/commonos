"use client";

import { Box, Typography, styled } from "@mui/material";

const InnerWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "25px 0",
}));

export default function Terms() {
  return (
    <InnerWrapper>
      <Typography whiteSpace="pre-line">{`Terms of Service for CommonOS

  Introduction
  
  This Terms of Service agreement governs your use of the CommonOS platform. By accessing or using CommonOS, you agree to be bound by these Terms of Service. If you do not agree to these Terms of Service, please do not use CommonOS. These Terms of Service may be updated from time to time without notice. You are encouraged to regularly review these Terms of Service for any changes.
  
  Unauthorized Usage
  
  - **Prohibited Activities:** Users are strictly prohibited from engaging in any unauthorized or unlawful activity while using CommonOS. This includes but is not limited to:
      - Attempting to breach security measures or gain unauthorized access to CommonOS or its users' data.
      - Intentionally introducing viruses, malware, or any other harmful code that may disrupt or damage CommonOS or its users' systems.
      - Using CommonOS for any illegal, fraudulent, or harmful purposes, including but not limited to hacking, phishing, or engaging in cyber-attacks.
  - **Misuse of Resources:** Users must not misuse CommonOS resources, such as excessive bandwidth usage or overloading the system, which may negatively impact the service's availability or performance for others.
  - **Intellectual Property Violations:** Users must respect intellectual property rights, refraining from using CommonOS to violate copyrights, trademarks, patents, or other proprietary rights of any third party.
  - **Unauthorized Commercial Use:** CommonOS is intended for personal or authorized business use. Unauthorized commercial exploitation, resale, or distribution of CommonOS services or any part thereof is strictly prohibited without explicit authorization.
  - **Impersonation or Misrepresentation:** Users must not impersonate any individual or entity, falsely claim an affiliation with CommonOS, or misrepresent themselves or their actions while using the service.
  - **Violation of Terms:** Failure to adhere to these terms may result in immediate suspension or termination of the user's account or access to CommonOS without prior notice.
  
  Data Collection
  
  We collect data from users in a limited capacity and solely for the purpose of improving our products and services. The data collected is accessible only to authorized personnel for specific purposes, such as analyzing user behavior for marketing purposes and improving our product or service. We handle all data collection in line with privacy laws and regulations.
  
  Data Protection
  
  We take the protection of your data seriously. Data collected from users is stored securely and is accessible to authorized personnel only. We use industry-standard security measures to protect your data from unauthorized access, disclosure, and alteration.
  
  Use of Data
  
  The data collected is used for the following purposes:
  
  - Improving our product or service to better meet the needs of our users.
  - Analyzing user behavior for marketing purposes to provide more relevant and personalized content to users.
  
  Third-Party Access
  
  We do not grant access to user data to any third parties. Your data is kept confidential and is only accessible to authorized personnel within CommonOS. We prioritize the privacy and security of our users and do not share any user data with third parties without consent.
  
  By using CommonOS, you acknowledge that you have read, understood, and agree to these Terms of Service. If you have any questions or concerns about these Terms of Service, please contact us at [contact information]. Thank you for using CommonOS and for your cooperation in complying with these Terms of Service.
  `}</Typography>
    </InnerWrapper>
  );
}
