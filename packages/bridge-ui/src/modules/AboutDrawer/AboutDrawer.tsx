import React from "react";
import { CustomDrawer } from "../../components";
import { Button, Typography } from "@chainsafe/common-components";
import { useStyles } from "./styles";

interface IAboutDrawerProps {
  open: boolean;
  close: () => void;
}

const AboutDrawer: React.FC<IAboutDrawerProps> = ({
  open,
  close,
}: IAboutDrawerProps) => {
  const classes = useStyles();

  return (
    <CustomDrawer onClose={close} open={open} className={classes.root}>
      <Typography variant="h1" component="h4">
        What is IceCream Bridge?
      </Typography>
      <Typography component="p" variant="h5">
        IceCream Bridge is a universal Bridge with the possibility to connect nearly all chains and all tokens.
        Besides beeing able to transfer Tokens this Bridge will later also be expanded to transfer NFTs between chains.
      </Typography>
      <section className={classes.buttons}>
        <Button onClick={() => close()} variant="outline">
          OK
        </Button>
        <a
          rel="noopener noreferrer"
          href={process.env.REACT_APP_SUPPORT_URL}
          target="_blank"
        >
          <Button variant="outline">
            Ask a question on {process.env.REACT_APP_SUPPORT_SERVICE}
          </Button>
        </a>
      </section>
    </CustomDrawer>
  );
};

export default AboutDrawer;
