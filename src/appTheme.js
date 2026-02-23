import { createTheme, responsiveFontSizes } from "@mui/material";

const headingFont = "'Google Sans', 'Helvetica Neue', Arial, sans-serif";
const bodyFont = "'Google Sans Text', 'Google Sans', 'Helvetica Neue', Arial, sans-serif";

let theme = createTheme({
  palette: {
    customYellow: {
      main: "rgb(226, 225, 130)",
      light: "rgb(235, 234, 170)",
      dark: "rgb(190, 189, 90)",
      contrastText: "#1a1a2e",
    },
    customBlue: {
      main: "rgb(51, 102, 122)",
      light: "rgb(80, 140, 165)",
      dark: "rgb(35, 75, 92)",
      contrastText: "#fff",
    },
    customGreen: {
      main: "rgb(83, 191, 102)",
      contrastText: "#fff",
    },
    customRed: {
      main: "rgb(243, 73, 60)",
      contrastText: "#fff",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: bodyFont,
    h1: {
      fontFamily: headingFont,
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: headingFont,
      fontWeight: 600,
      letterSpacing: "-0.015em",
      lineHeight: 1.25,
    },
    h3: {
      fontFamily: headingFont,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: headingFont,
      fontWeight: 600,
      letterSpacing: "-0.005em",
      lineHeight: 1.35,
    },
    h5: {
      fontFamily: headingFont,
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: headingFont,
      fontWeight: 500,
      lineHeight: 1.45,
    },
    subtitle1: {
      fontFamily: bodyFont,
      fontWeight: 500,
      fontSize: "1.05rem",
      lineHeight: 1.6,
      letterSpacing: "0.005em",
    },
    subtitle2: {
      fontFamily: bodyFont,
      fontWeight: 500,
      fontSize: "0.9rem",
      lineHeight: 1.55,
      letterSpacing: "0.005em",
    },
    body1: {
      fontFamily: bodyFont,
      fontWeight: 400,
      lineHeight: 1.7,
      letterSpacing: "0.01em",
    },
    body2: {
      fontFamily: bodyFont,
      fontWeight: 400,
      lineHeight: 1.65,
      letterSpacing: "0.01em",
    },
    caption: {
      fontFamily: bodyFont,
      fontWeight: 400,
      letterSpacing: "0.02em",
    },
    overline: {
      fontFamily: bodyFont,
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    button: {
      fontFamily: bodyFont,
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "12px 28px",
          fontWeight: 600,
          fontSize: "0.95rem",
          letterSpacing: "0.3px",
          boxShadow: "none",
          transition: "all 0.25s ease",
          "&:hover": {
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        sizeLarge: {
          padding: "14px 36px",
          fontSize: "1rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "rgba(248, 249, 250, 0.6)",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(248, 249, 250, 0.9)",
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
              boxShadow: "0 0 0 3px rgba(51, 102, 122, 0.12)",
            },
          },
          "& .MuiFilledInput-root": {
            borderRadius: "10px 10px 0 0",
            backgroundColor: "rgba(248, 249, 250, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(248, 249, 250, 1)",
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 500,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiFormLabel-root": {
            fontWeight: 500,
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          "& .MuiTypography-root": {
            fontSize: "0.92rem",
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
