import { Box, Button, Typography, styled } from "@mui/material";

const Footer = styled("footer")(({ theme }) => ({
  width: "100%",
  padding: "35px 0 50px 0",
  backgroundColor: theme.palette.background.default,
  borderTop: "1px solid #ccc",
}));

const InnerWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
}));

export default function SiteFooter() {
  return (
    <Footer>
      <InnerWrapper>
        <Box>
          <Typography variant="h6" component="div" sx={{ marginBottom: 1 }}>
            CommonOS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Common
          </Typography>
        </Box>
        <Box>
          <Button href="/terms">Terms</Button>
          <Button href="/privacy-policy">Privacy Policy</Button>
        </Box>
      </InnerWrapper>
    </Footer>
  );
}
