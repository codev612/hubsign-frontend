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
import { plans } from "@/constants/constants";
import Sidebar from "@/components/layouts/dashboard/sidebar";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const faqsR = [
  {
    title: "What pricing plans do you offer?",
    content: "We offer three tiers to meet different needs:Basic Plan: Ideal for individuals and small-scale use.Pro Plan: Designed for small to medium-sized teams requiring advanced features.Enterprise Plan: Perfect for larger organizations with custom requirements and premium support."
  },
  {
    title: "What features are included in each plan?",
    content: "Basic Plan: Includes unlimited signatures, document tracking, and email notifications.Pro Plan: Adds team collaboration, custom branding, and integrations with tools like Google Drive and Dropbox.Enterprise Plan: Offers all Pro features plus API access, advanced security options, and dedicated account management."
  },
  {
    title: " How much do the plans cost?",
    content: "Basic Plan: $10/month per user. Pro Plan: $25/month per user. Enterprise Plan: Custom pricing based on your needs."
  },
  {
    title: "Do you offer a free trial?",
    content: "Yes, we offer a 14-day free trial for all plans. No credit card required! You can explore the features of any plan risk-free."
  },
]

const faqL = [
  {
    title: "Can I upgrade or downgrade my plan?",
    content: "Absolutely! You can switch between plans at any time. Upgrades take effect immediately, while downgrades are applied at the start of the next billing cycle."
  },
  {
    title: "Are there discounts for annual subscriptions?",
    content: "Yes, we offer a 20% discount if you choose to pay annually instead of monthly. It’s a great way to save while committing to a solution that works for you."
  },
  {
    title: "Is there a limit to the number of documents or signatures?",
    content: "Basic Plan: Unlimited documents and signatures.Pro and Enterprise Plans: Also include unlimited usage, with additional features designed to optimize workflow."
  },
  {
    title: "What payment methods do you accept?",
    content: "We accept all major credit cards, including Visa, Mastercard, and American Express. For Enterprise customers, we also support invoicing and bank transfers."
  }
]

export default function Plan() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  return (
    <>
        {/* <Sidebar /> */}
        <div className="flex flex-col h-screen w-full p-4 bg-forecolor gap-4">
            <div className="flex flex-row justify-between">
                <h1 className="title-medium ">Documents</h1>
                <Button
                    fullWidth
                    className="text-white w-151"
                    color="primary"
                    size="md"
                    type="submit"
                >
                    <AddOutlinedIcon /> New Document
                </Button>
            </div>
        </div>
    </>
  );
}
