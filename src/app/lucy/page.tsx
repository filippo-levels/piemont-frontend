"use client";
import { useState } from "react";
import ChatHistory from "@/app/lucy/ChatHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function LucyPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center py-10">
          <h1 className="text-3xl font-bold mb-4">
            Assistente Virtuale Lucy
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Consulta lo storico delle tue conversazioni con Lucy, l'assistente virtuale per i disciplinari di gara.
          </p>
        </div>
        
        <Card className="border-none shadow-sm mb-6">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-normal">Le tue conversazioni</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ChatHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 