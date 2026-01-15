import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, Loader2, Bot, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { messages: [...messages, userMessage] }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err: any) {
      toast.error('Error al conectar con el asistente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-amber-500" />
          Asistente IA
        </h1>
        <p className="text-muted-foreground">Ayuda inteligente para tu facturación</p>
      </div>

      <Card className="flex-1 flex flex-col h-[calc(100%-5rem)]">
        <CardHeader>
          <CardTitle className="text-lg">Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px]">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>¡Hola! Soy tu asistente de facturación.</p>
                <p className="text-sm mt-2">Puedo ayudarte a crear documentos, buscar clientes, calcular totales y más.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${msg.role === 'user' ? 'bg-amber-500' : 'bg-muted'}`}>
                      {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-amber-500 text-white' : 'bg-muted'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3">
                <div className="p-2 rounded-full bg-muted"><Bot className="h-4 w-4" /></div>
                <div className="p-3 rounded-lg bg-muted"><Loader2 className="h-4 w-4 animate-spin" /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading} className="bg-amber-500 hover:bg-amber-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
