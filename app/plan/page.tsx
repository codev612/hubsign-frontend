"use client";

import React, { useState } from "react";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Button } from "@nextui-org/button";
import LoadingButton from "@/components/common/loadingbutton";
import { siteConfig } from "@/config/site";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import StateBoard from "@/components/common/stateboard";
import PlanCard from "@/components/pages/plan/plancard";
import { Divider } from "@nextui-org/react";
import {Accordion, AccordionItem} from "@nextui-org/react";

export default function Plan() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  return (
    <>
      <section className="flex flex-col items-center sm:items-start justify-center gap-4 py-12 my-3">
        <p className="title title-large">Update your plan</p>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <PlanCard />
          <PlanCard />
          <PlanCard />
        </div>
      </section>
      <Divider />
      <section className="flex flex-col items-center sm:items-start gap-4 py-12 my-3">
        <p className="title title-large">eSign plans and pricing FAQ</p>
        <Divider />
        <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
        <Accordion 
        className="p-0"
        itemClasses={{title:"title-tiny", content:"text-summary"}}
        >
          <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
            {defaultContent}
          </AccordionItem>
          <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
            {defaultContent}
          </AccordionItem>
          <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
            {defaultContent}
          </AccordionItem>
          <AccordionItem key="4" aria-label="Accordion 4" title="Accordion 4">
            {defaultContent}
          </AccordionItem>
        </Accordion>
        <Accordion 
        className="p-0"
        itemClasses={{title:"title-tiny", content:"text-summary"}}
        >
          <AccordionItem key="5" aria-label="Accordion 5" title="Accordion 5">
            {defaultContent}
          </AccordionItem>
          <AccordionItem key="6" aria-label="Accordion 6" title="Accordion 6">
            {defaultContent}
          </AccordionItem>
          <AccordionItem key="7" aria-label="Accordion 7" title="Accordion 7">
            {defaultContent}
          </AccordionItem>
          <AccordionItem key="8" aria-label="Accordion 8" title="Accordion 8">
            {defaultContent}
          </AccordionItem>
        </Accordion>
        </div>
      </section>
    </>
  );
}
