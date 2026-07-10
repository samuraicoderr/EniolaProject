"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, { ChatMessageItem } from "@/lib/api/services/Yoruba.Service";
import { YorubaMascot } from "@/components/ui/YorubaMascot";

export default function CoachPage() {
  const auth = useRequiredAuth();
  const [active, setActive] = useState(true);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [mascotState, setMascotState] = useState<"idle" | "speaking" | "happy" | "thinking">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
