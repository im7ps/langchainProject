export interface Message {
  id: number;
  sender: "user" | "ai" | "system";
  text: string;
}