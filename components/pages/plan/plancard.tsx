import { 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter, 
    Divider, 
    Link, 
    Image 
} from "@nextui-org/react";
import React from 'react';
import LoadingButton from "@/components/common/loadingbutton";
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

const PlanCard: React.FC = () => {
  return (
    <Card className="max-w-[384px] min-w-[250px] mx-auto p-6 m-0 bg-forecolor">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="title title-medium">Personal</h1>
          <p className="text-summary">For individuals and sole proprietors with basic e-signature needs </p>
        </div>
      </CardHeader>
      <CardBody>
        <h1 className="mb-3 title title-small">$5/month</h1>
        <Divider />
      </CardBody>
      <CardFooter className="pt-0">
        <div className="flex flex-col gap-2 text-item">
          <p><CheckBoxOutlinedIcon className="mr-1" />Up to 5 agreements for signature per month</p>
          <p><CheckBoxOutlinedIcon className="mr-1" />Up to 5 agreements for signature per month</p>
          <p><CheckBoxOutlinedIcon className="mr-1" />Up to 5 agreements for signature per month</p>
        </div>
        
      </CardFooter>
      <div className="p-3">
        <LoadingButton title="Buy Now" />
      </div>
    </Card>
  );
};

export default PlanCard;
