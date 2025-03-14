"use client";

import { Button } from "@heroui/button";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useRouter } from "next/navigation";

import { PageTitleBarProps } from "@/interface/interface";
import { useModal } from "@/context/modal";

const PageTitleBar: React.FC<PageTitleBarProps> = ({
  pageTitle,
  buttonTitle,
  buttonLink,
  description = "",
}) => {
  const router = useRouter();
  const modalContext = useModal();

  const handleClick = () => {
    router.push(buttonLink);
  };

  const handleButtonClick = (buttonType:string) => {
    switch (buttonType) {
      case "contact":
        modalContext.openCreateContact();
        break;
      case "template":
        modalContext.openCreateTemplate();
        break;
      default:
        router.push(buttonType);
        break;
    }
  }

  return (
    <section>
      <div className="flex flex-row justify-between">
        <h1 className="title-medium ">{pageTitle}</h1>
        <Button
          fullWidth
          className="text-white w-151"
          color="primary"
          size="md"
          onPress={()=>handleButtonClick(buttonLink)}
        >
          <AddOutlinedIcon /> {buttonTitle}
        </Button>
      </div>
      {description ? (
        <div className="flex flex-row text-text">
          <p>{description}</p>
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

export default PageTitleBar;
