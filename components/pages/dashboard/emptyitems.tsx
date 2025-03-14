import { Button } from '@heroui/button';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';

type Action = () => void;

interface ComponentProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    button: React.ReactNode;
}

const EmptyItems:React.FC<ComponentProps> = ({icon, title, description, button}) => {
    return (
        <div className="flex flex-col bg-[#2563EB]/5 rounded-md p-4 gap-2 items-center">
            <div className="flex flex-col items-center">
                {icon}
            </div>
            <p className='text-text title-medium'>{title}</p>
            <p>{description}</p>
            <div>
                {button}
            </div>
        </div>
    )
}

export default EmptyItems;