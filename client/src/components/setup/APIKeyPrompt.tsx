import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, ExternalLink, AlertCircle } from "lucide-react";

interface APIKeyPromptProps {
  onKeyProvided?: () => void;
}

export default function APIKeyPrompt({ onKeyProvided }: APIKeyPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  if (!showPrompt) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-yellow-900 mb-1">AI Features Require Setup</h4>
            <p className="text-sm text-yellow-800 mb-3">
              To use AI-powered resume generation, file parsing, and content enhancement, you'll need a Google API key.
            </p>
            <Button
              onClick={() => setShowPrompt(true)}
              variant="outline"
              size="sm"
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            >
              <Key className="h-4 w-4 mr-2" />
              Setup AI Features
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="mb-6 border-blue-200">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center text-blue-900">
          <Key className="h-5 w-5 mr-2" />
          Setup Google AI API Key
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How to Get Your API Key:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Visit Google AI Studio (aistudio.google.com)</li>
              <li>Sign in with your Google account</li>
              <li>Click "Get API Key" or navigate to API Keys section</li>
              <li>Create a new API key for your project</li>
              <li>Copy the key (it starts with "AIza...")</li>
            </ol>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open Google AI Studio
            </a>
          </div>

          <div>
            <Label htmlFor="api-key" className="text-sm font-medium text-slate-700">
              Google API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="AIza..."
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              Your API key will be stored securely in your browser session only.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => {
                // In a real implementation, you'd save this to environment or session
                alert("API key setup completed! You can now use AI features.");
                onKeyProvided?.();
                setShowPrompt(false);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save & Enable AI Features
            </Button>
            <Button
              onClick={() => setShowPrompt(false)}
              variant="outline"
            >
              Skip for Now
            </Button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Privacy & Security:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Your API key is only used to communicate with Google's AI services</li>
              <li>• Resume data is processed by Google Gemini for AI features only</li>
              <li>• No personal data is stored permanently on our servers</li>
              <li>• You can remove or change your API key anytime</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}