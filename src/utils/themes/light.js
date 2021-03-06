const light = {
  direction: "rtl",
  palette: {
    type: "light",
    primary: {
      light: "#449cd2",
      main: "#1566a0",
      dark: "#1566a0"
    },
    secondary: {
      main: "#E89C68"
    },
    default: {
      main: "f8f8f8"
    },
    border: {
      light: "#f8f8f8",
      main: "#f8f8f8",
      strong: "#f2f2f2"
    },
    background: {
      light: "white",
      main: "#f8f8f8",
      dark: "#f7f7f7"
    }
  },
  shape: {
    borderRadius: 4
  },
  shadows: [
    "none",
    "rgba(0, 0, 0, 0.15) 0px 2px 8px !important"
  ],
  typography: {
    fontFamily: ["Rubik", "sans-serif"],
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
      padding: ".5rem 0",
      color: "black"
    },
    h2: {
      fontSize: "1.3rem",
      fontWeight: 500,
      color: "#3B3439",
      margin: "16px 0 8px 0"
    },
    h3: {
      fontSize: "1.1rem",
      fontWeight: 500,
      color: "#3B3439",
      margin: "16px 0 8px 0"
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#3B3439",
      margin: "8px 0"
    },
    subtitle1: {
      fontSize: ".75rem",
      color: "#9c9c9c"
    },
    subtitle2: {
      fontSize: ".6rem",
      fontWeight: 300,
      color: "#9c9c9c"
    },
    body1: {
      fontSize: "1rem",
      color: "#313131",
      fontWeight: 400
    },
    body2: {
      fontSize: ".9rem"
    }
  }
}

export default light;
