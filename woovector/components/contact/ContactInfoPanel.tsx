import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Clock, MessageSquare } from "lucide-react";

export function ContactInfoPanel() {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
        <CardContent className="space-y-4 p-6">
          <Badge className="bg-primary/10 text-primary" variant="secondary">
            Support that cares
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight">We’re here to help you ship faster.</h2>
          <p className="text-muted-foreground leading-relaxed">
            WooVector support specialists respond to every message personally. Share as much detail as you can so we can unblock you quickly and keep your storefront running smoothly.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 flex-shrink-0 text-primary" strokeWidth={2.5} />
            <div>
              <p className="font-semibold">Response time</p>
              <p className="text-sm text-muted-foreground">We reply within 24 hours on weekdays and monitor urgent platform issues 24/7.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 flex-shrink-0 text-primary" strokeWidth={2.5} />
            <div>
              <p className="font-semibold">Data handled safely</p>
              <p className="text-sm text-muted-foreground">We only store the essentials to respond to your request. Everything stays within EU-based infrastructure.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 flex-shrink-0 text-primary" strokeWidth={2.5} />
            <div>
              <p className="font-semibold">Prefer email?</p>
              <p className="text-sm text-muted-foreground">
                Send a message to <span className="font-medium text-primary">support@woovector.com</span> with your reference number and we’ll continue the conversation there.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

