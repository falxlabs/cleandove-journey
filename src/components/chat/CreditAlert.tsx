import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CreditAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditAlert = ({ open, onOpenChange }: CreditAlertProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Out of Credits</AlertDialogTitle>
        <AlertDialogDescription>
          You've reached your credit limit. Each AI response costs 1 credit, and
          you're currently out of credits.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={() => onOpenChange(false)}>
          Understood
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);