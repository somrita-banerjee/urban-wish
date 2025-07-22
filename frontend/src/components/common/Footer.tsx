// components/common/Footer.tsx
const Footer = () => {
  return (
    <footer className="text-center text-sm py-4 mt-4 border-t bg-gray-100 text-muted-foreground">
      &copy; {new Date().getFullYear()} Urban Wish. All rights reserved.
    </footer>
  );
};

export default Footer;
