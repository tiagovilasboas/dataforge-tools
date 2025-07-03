import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Code, Eye, Trash2, Play } from "lucide-react";
import { useJwtDecoder } from "./useJwtDecoder";

function JwtInput({ 
  input, 
  setInput, 
  decodeJwt, 
  clearInput, 
  loadSample 
}: ReturnType<typeof useJwtDecoder>) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('jwtDecoder.input.title')}
        </CardTitle>
        <CardDescription>
          {t('jwtDecoder.input.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder={t('jwtDecoder.input.placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[120px] font-mono text-sm"
        />
        <div className="flex gap-2">
          <Button onClick={decodeJwt} className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            {t('jwtDecoder.actions.decode')}
          </Button>
          <Button variant="outline" onClick={loadSample} className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            {t('jwtDecoder.actions.loadSample')}
          </Button>
          <Button variant="outline" onClick={clearInput} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            {t('jwtDecoder.actions.clear')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function JwtOutput({ 
  decoded, 
  isValid, 
  errors 
}: Pick<ReturnType<typeof useJwtDecoder>, 'decoded' | 'isValid' | 'errors'>) {
  const { t } = useTranslation();

  if (!decoded && errors.length === 0) {
    return null;
  }

  if (errors.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Eye className="h-5 w-5" />
            {t('jwtDecoder.output.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!decoded) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          {t('jwtDecoder.output.title')}
        </CardTitle>
        <CardDescription>
          {t('jwtDecoder.output.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant={isValid ? "default" : "destructive"}>
            {isValid ? t('jwtDecoder.validation.valid') : t('jwtDecoder.validation.invalid')}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Header */}
          <div>
            <h4 className="font-semibold mb-2">{t('jwtDecoder.output.header')}</h4>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
              <code>{JSON.stringify(decoded.header, null, 2)}</code>
            </pre>
          </div>

          <Separator />

          {/* Payload */}
          <div>
            <h4 className="font-semibold mb-2">{t('jwtDecoder.output.payload')}</h4>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
              <code>{JSON.stringify(decoded.payload, null, 2)}</code>
            </pre>
          </div>

          <Separator />

          {/* Signature */}
          <div>
            <h4 className="font-semibold mb-2">{t('jwtDecoder.output.signature')}</h4>
            <div className="bg-muted p-4 rounded-md text-sm font-mono break-all">
              {decoded.signature}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function JwtDecoder() {
  const { t } = useTranslation();
  const jwtDecoder = useJwtDecoder();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('jwtDecoder.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('jwtDecoder.subtitle')}
          </p>
        </div>
        <div className="flex-1" />
      </div>

      <div className="grid gap-6">
        <JwtInput {...jwtDecoder} />
        <JwtOutput {...jwtDecoder} />
      </div>
    </div>
  );
} 