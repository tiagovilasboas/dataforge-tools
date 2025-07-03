import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Play, 
  Code, 
  Copy,
  Mail,
  Phone,
  Calendar,
  Link,
  Trash2
} from "lucide-react";
import { useRegexTester } from "./useRegexTester";

function RegexInput({ 
  config, 
  setConfig, 
  testRegex, 
  clearResult,
  loadSample,
  loadEmailSample,
  loadPhoneSample,
  loadDateSample,
  loadUrlSample,
  loadWordSample,
  loadNumberSample,
  loadCpfSample,
  loadCepSample,
  loadTimeSample,
  loadIpSample,
  loadCreditCardSample,
  loadHtmlTagSample,
  loadCamelCaseSample,
  loadSnakeCaseSample,
  loadHexColorSample
}: ReturnType<typeof useRegexTester>) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          {t('regexTester.input.title')}
        </CardTitle>
        <CardDescription>
          {t('regexTester.input.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Padrão e Flags */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-medium">{t('regexTester.input.pattern')}</label>
            <Input
              placeholder="/padrão/"
              value={config.pattern}
              onChange={(e) => setConfig(prev => ({ ...prev, pattern: e.target.value }))}
              className="font-mono"
            />
          </div>
          <div>
            <label className="text-sm font-medium">{t('regexTester.input.flags')}</label>
            <Input
              placeholder="g"
              value={config.flags}
              onChange={(e) => setConfig(prev => ({ ...prev, flags: e.target.value }))}
              className="font-mono"
            />
          </div>
        </div>

        {/* String de teste */}
        <div>
          <label className="text-sm font-medium">{t('regexTester.input.testString')}</label>
          <Textarea
            placeholder={t('regexTester.input.testStringPlaceholder')}
            value={config.testString}
            onChange={(e) => setConfig(prev => ({ ...prev, testString: e.target.value }))}
            className="min-h-[100px]"
          />
        </div>

        {/* String de substituição */}
        <div>
          <label className="text-sm font-medium">{t('regexTester.input.replaceString')}</label>
          <Input
            placeholder={t('regexTester.input.replaceStringPlaceholder')}
            value={config.replaceString}
            onChange={(e) => setConfig(prev => ({ ...prev, replaceString: e.target.value }))}
          />
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          <Button onClick={testRegex} className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            {t('regexTester.actions.test')}
          </Button>
          <Button onClick={clearResult} variant="outline" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            {t('regexTester.actions.clear')}
          </Button>
        </div>

        {/* Exemplos */}
        <div>
          <label className="text-sm font-medium mb-2 block">{t('regexTester.input.examples')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <Button onClick={loadSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              {t('regexTester.examples.basic')}
            </Button>
            <Button onClick={loadEmailSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t('regexTester.examples.email')}
            </Button>
            <Button onClick={loadPhoneSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {t('regexTester.examples.phone')}
            </Button>
            <Button onClick={loadDateSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('regexTester.examples.date')}
            </Button>
            <Button onClick={loadUrlSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              {t('regexTester.examples.url')}
            </Button>
            <Button onClick={loadWordSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Palavras
            </Button>
            <Button onClick={loadNumberSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Números
            </Button>
            <Button onClick={loadCpfSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              CPF
            </Button>
            <Button onClick={loadCepSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              CEP
            </Button>
            <Button onClick={loadTimeSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Horário
            </Button>
            <Button onClick={loadIpSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              IP
            </Button>
            <Button onClick={loadCreditCardSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Cartão
            </Button>
            <Button onClick={loadHtmlTagSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              HTML
            </Button>
            <Button onClick={loadCamelCaseSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              CamelCase
            </Button>
            <Button onClick={loadSnakeCaseSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              snake_case
            </Button>
            <Button onClick={loadHexColorSample} variant="outline" size="sm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Cores
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RegexOutput({ 
  result, 
  errors 
}: Pick<ReturnType<typeof useRegexTester>, 'result' | 'errors'>) {
  const { t } = useTranslation();

  if (errors.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Search className="h-5 w-5" />
            {t('regexTester.output.title')}
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

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t('regexTester.output.title')}
          </CardTitle>
          <CardDescription>
            {t('regexTester.output.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {t('regexTester.output.empty')}
          </div>
        </CardContent>
      </Card>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          {t('regexTester.output.title')}
        </CardTitle>
        <CardDescription>
          {t('regexTester.output.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge variant={result.isValid ? "default" : "destructive"}>
            {result.isValid ? t('regexTester.validation.valid') : t('regexTester.validation.invalid')}
          </Badge>
          <Badge variant="outline">
            {result.matches.length} {t('regexTester.output.matches')}
          </Badge>
        </div>

        {/* Matches */}
        {result.matches.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">{t('regexTester.output.matches')}</h4>
            <div className="space-y-2">
              {result.matches.map((match, index) => (
                <div key={index} className="bg-muted p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="font-mono">{match.match}</span>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(match.match)}
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {t('regexTester.output.index')}: {match.index}
                  </div>
                  {match.groups && match.groups.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {t('regexTester.output.groups')}: {match.groups.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Substituição */}
        {result.replaceResult && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">{t('regexTester.output.replacement')}</h4>
              <div className="bg-muted p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <pre className="text-sm whitespace-pre-wrap">{result.replaceResult}</pre>
                  <Button
                    onClick={() => copyToClipboard(result.replaceResult!)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function RegexTester() {
  const { t } = useTranslation();
  const regexTester = useRegexTester();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('regexTester.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('regexTester.subtitle')}
          </p>
        </div>
        <div className="flex-1" />
      </div>

      <div className="grid gap-6">
        <RegexInput {...regexTester} />
        <RegexOutput {...regexTester} />
      </div>
    </div>
  );
} 