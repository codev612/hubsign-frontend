import { Button } from "@nextui-org/button";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { PageTitleBarProps } from "@/interface/interface";

const PageTitleBar: React.FC<PageTitleBarProps> = ({pageTitle, buttonTitle}) => {
    return(
        <div className="flex flex-row justify-between">
            <h1 className="title-medium ">{pageTitle}</h1>
            <Button
                fullWidth
                className="text-white w-151"
                color="primary"
                size="md"
                type="submit"
            >
                <AddOutlinedIcon /> {buttonTitle}
            </Button>
        </div>
    );
}

export default PageTitleBar;