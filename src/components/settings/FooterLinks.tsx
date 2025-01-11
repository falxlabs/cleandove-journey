import { Button } from "@/components/ui/button";

const FooterLinks = () => {
  return (
    <div className="px-6 mt-8 space-y-4">
      <Button variant="link" className="text-primary">TERMS</Button>
      <Button variant="link" className="text-primary">PRIVACY POLICY</Button>
      <Button variant="link" className="text-primary">ACKNOWLEDGEMENTS</Button>
    </div>
  );
};

export default FooterLinks;