import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme";

export const useStyles = makeStyles(
  ({ constants, palette, zIndex }: ITheme) => {
    return createStyles({
      root: {
        color: "#fff",
        backgroundColor: 'rgba(0,0,0,0.5)',
        boxShadow: '24',
      },
      slide: {
        borderRadius : '15px',
        width: '100%',
        backgroundColor : '#1e1f24',
        padding: `${constants.generalUnit}px ${constants.generalUnit * 2}px`,
        "& > p": {
          marginTop: constants.generalUnit * 2,
          marginBottom: constants.generalUnit * 3,
          textAlign: "center",
        },
      },
      buttons: {
        marginBottom: constants.generalUnit * 2,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      },
      btn: {
        borderRadius : '15px',
        height : '50px',
        fontWeight : 'bold',
        backgroundColor : '#2792d6',
        color : '#fff',
        fontSize : '15px',
      }
    });
  }
);
