import { makeStyles, createStyles, ITheme } from "@chainsafe/common-theme";

export const useStyles = makeStyles(({ constants, palette, zIndex }: ITheme) =>
  createStyles({
    root: {
      zIndex: zIndex?.blocker,
      position: "absolute",
      width : "100%",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      "& li": {
        position: "relative",
        padding: `${constants.generalUnit}px 0 ${constants.generalUnit}px ${
          constants.generalUnit * 4
        }px`,
        "&:before": {
          content: "''",
          display: "block",
          backgroundColor: palette.additional["gray"][2],
          height: constants.generalUnit,
          width: constants.generalUnit,
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: constants.generalUnit * 2,
          transform: "translate(-50%, -50%)",
        },
      },
    },
    subtitle: {
      margin: `${constants.generalUnit * 2}px 0`,
    },
    agreement: {
      justifyContent: 'space-between',
      margin: `${constants.generalUnit * 2}px 0`,
    },
    list_agg: {
      fontSize : '0.7rem',
    },
    startButton: {
      backgroundColor: "#f07093",
      borderRadius: "20px",
      fontWeight : "bold",
      color: "#fff",
      marginBottom: constants.generalUnit * 2,
    },
    backdrop: {
      zIndex: zIndex?.layer4,
    },
  })
);
