"use client";

import { Button } from "@nextui-org/button";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useRouter } from "next/navigation";

import { PageTitleBarProps } from "@/interface/interface";

const PageTitleBar: React.FC<PageTitleBarProps> = ({
  pageTitle,
  buttonTitle,
  buttonLink,
  description = "",
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(buttonLink);
  };

  return (
    <section>
      <div className="flex flex-row justify-between">
        <h1 className="title-medium ">{pageTitle}</h1>
        <Button
          fullWidth
          className="text-white w-151"
          color="primary"
          size="md"
          onPress={handleClick}
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
