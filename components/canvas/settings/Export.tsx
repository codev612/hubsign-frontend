import { Button } from "../ui/button";

import { exportToPdf } from "@/lib/canvas/utils";

const Export = () => (
  <div className="flex flex-col gap-3 px-5 py-3">
    <h3 className="text-[10px] uppercase">Export</h3>
    <Button
      className="w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black"
      variant="outline"
      onClick={exportToPdf}
    >
      Export to PDF
    </Button>
  </div>
);

export default Export;
