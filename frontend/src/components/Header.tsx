import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b-1 border-gray-400 sticky bg-background">
      <div className="container mx-auto py-4 px-4 w-5/6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            Todo App <span className="text-purple-500 text-3xl">.</span>
          </h1>
        </div>
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
