import { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Divider,
} from "@heroui/react";
import { useCanvas } from "@/context/canvas";
import { Recipient } from "@/interface/interface";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { getFutureDate } from "@/utils/canvas/utils";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onOpenChange: (isOpen: boolean) => void;
  recepients: Recipient[];
}

const ReviewModal: React.FC<ModalProps> = ({
    isOpen,
    onOpenChange,
    title,
    recepients,
}) => {

    const canvasContextValues = useCanvas();

    const [isCC, setIsCC] = useState<boolean>(false);
    const [ccRecepients, setCCRecepients] = useState<string[]>([]);// cc recepients
    const [addCC, setAddCC] = useState<string>("");  // add cc recepient item

    const [isAutoReminder, setIsAutoReminder] = useState<boolean>(false);
    const [reminderIn, setReminderIn] = useState<number>(1); // send first reminder in x days
    const [reminderRepeat, setReminderRepeat] = useState<number>(7); // repeat reminder in every x days

    const [isCustomExpDay, setIsCustomExpDay] = useState<boolean>(false);
    const [expiresDay, setExpiresDay] = useState<number>(120) // expires in x days

    const onClose = () => {
        canvasContextValues.setShowReviewModal(false);
    }

    const handleAddCC = () => {
        if (!ccRecepients.includes(addCC)) {
            setCCRecepients((prevItems) => (addCC ? [...prevItems, addCC] : prevItems));
            setAddCC("");
        }
    }

    const handleSaveDoc = () => {
        canvasContextValues.handleSaveDoc();
    };

    return (
        <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="4xl"
        onOpenChange={onOpenChange}
        onClose={onClose}
        >
            <ModalContent>
                {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 title-large">{title}</ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col title-medium gap-1">
                                <h1>Recepients</h1>
                                {(recepients.length > 0) && recepients.map((rec,index) => <div key={index} className="flex flex-row text-medium text-text gap-1 items-center">
                                    <span>{`${index+1}.`}</span>
                                    <input 
                                    className="border-1 rounded-lg w-full p-2"
                                    value={rec.email}
                                    readOnly
                                    />
                                </div>)}
                            </div>
                            <div className="flex flex-col title-medium gap-1">
                                <h1>Advanced</h1>
                                <Switch isSelected={isCC} onValueChange={setIsCC}>CC others who need a copy</Switch>
                                {isCC && ccRecepients.length > 0 && ccRecepients.map((rec, index) => <div key={index} className="flex flex-row gap-2 text-medium text-text">
                                    <input className="border-1 rounded-lg w-full p-2" defaultValue={rec} />
                                    <button
                                    className="border-1 rounded-md w-[33]"
                                    onClick={() => setCCRecepients(ccRecepients.filter((_, i) => i !== index))}
                                    >
                                        <RemoveOutlinedIcon />                                    
                                    </button>
                                </div>)}
                                {isCC && <div className="flex flex-row text-medium text-text gap-2">
                                    <input className="border-1 rounded-lg w-full p-2" value={addCC} onChange={(e) => setAddCC(e.target.value)}/>
                                    <button
                                    className="border-1 rounded-md w-[33]"
                                    onClick={handleAddCC}
                                    >
                                        <AddOutlinedIcon />
                                    </button>
                                </div>}
                                <Divider />
                                <Switch isSelected={isAutoReminder} onValueChange={setIsAutoReminder}>Auto-reminders</Switch>
                                {isAutoReminder && <div className="flex flex-row gap-1 items-center">
                                    <span className="text-medium">Send first reminder in</span>
                                    <input
                                    className="border-1 rounded-md w-[33] text-center"
                                    value={reminderIn}
                                    onChange={(e) => setReminderIn(Number(e.target.value))}
                                    />
                                    <span className="text-medium">days</span>
                                </div>}
                                {isAutoReminder && <div className="flex flex-row gap-1 items-center">
                                    <span className="text-medium">Repeat reminder every</span>
                                    <input
                                    className="border-1 rounded-md w-[33] text-center"
                                    value={reminderRepeat}
                                    onChange={(e) => setReminderRepeat(Number(e.target.value))}
                                    />
                                    <span className="text-medium">days</span>
                                </div>}
                                <Divider />
                                <Switch isSelected={isCustomExpDay} onValueChange={setIsCustomExpDay}>Set custom expiration day</Switch>
                                {isCustomExpDay && <p className="text-sm text-text">By default, documents expire in 120 days. Recepients can no longer view or sign documents after it expires</p>}
                                {isCustomExpDay && <div className="flex flex-col">
                                    <p className="text-medium">Days until document expires</p>
                                    <input 
                                    className="border-1 rounded-lg w-full p-2 text-medium text-text" 
                                    value={expiresDay}
                                    onChange={(e)=>setExpiresDay(Number(e.target.value))}
                                    />
                                    <p><span className="text-sm text-text">Document will expire on</span><span className="text-medium">{` ${getFutureDate(expiresDay)}`}</span></p>
                                </div>}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                    <Button variant="bordered" onPress={onClose}>
                        Back
                    </Button>
                    <Button
                        className="text-white"
                        color="primary"
                        type="submit"
                        onPress={() => handleSaveDoc()}
                    >
                        Send this document
                    </Button>
                    </ModalFooter>
                </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ReviewModal;
