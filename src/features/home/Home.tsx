import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Code, 
  FileSpreadsheet, 
  Shield, 
  Search, 
  Database, 
  Image,
  Zap, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Clock,
  Heart,
  Github,
  Linkedin,
  TrendingUp,
  Award,
  Rocket,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();
  
  // Classificação por prioridade de uso (5 = mais usado, 1 = menos usado)
  const features = [
    {
      icon: Code,
      title: t('home.features.jsonTools.title'),
      description: t('home.features.jsonTools.description'),
      path: "/json",
      color: "sky",
      badge: "Essencial",
      priority: 5, // JSON é usado constantemente por devs
      usage: "Diário",
      category: "Dados"
    },
    {
      icon: FileSpreadsheet,
      title: t('home.features.csvTools.title'), 
      description: t('home.features.csvTools.description'),
      path: "/csv",
      color: "emerald",
      badge: "Popular",
      priority: 4, // CSV muito usado para dados
      usage: "Frequente",
      category: "Dados"
    },
    {
      icon: Shield,
      title: t('home.features.jwtDecoder.title'),
      description: t('home.features.jwtDecoder.description'),
      path: "/jwt",
      color: "indigo",
      badge: "Segurança",
      priority: 4, // JWT muito usado em APIs
      usage: "Frequente",
      category: "Segurança"
    },
    {
      icon: Search,
      title: t('home.features.regexTester.title'),
      description: t('home.features.regexTester.description'),
      path: "/regex",
      color: "rose",
      badge: "Dev Tool",
      priority: 3, // Regex usado ocasionalmente
      usage: "Ocasional",
      category: "Desenvolvimento"
    },
    {
      icon: Database,
      title: t('home.features.mockGenerator.title'),
      description: t('home.features.mockGenerator.description'),
      path: "/mock",
      color: "pink",
      badge: "Testes",
      priority: 3, // Mock data para testes
      usage: "Ocasional",
      category: "Testes"
    },
    {
      icon: Image,
      title: t('home.features.svgConverter.title'),
      description: t('home.features.svgConverter.description'),
      path: "/svg",
      color: "teal",
      badge: "Frontend",
      priority: 2, // SVG converter menos usado
      usage: "Específico",
      category: "Frontend"
    }
  ];

  const benefits = t('home.benefits.items', { returnObjects: true }) as string[];

  const renderStars = (priority: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < priority ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 5: return "Essencial";
      case 4: return "Muito Usado";
      case 3: return "Útil";
      case 2: return "Específico";
      case 1: return "Nicho";
      default: return "Básico";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col justify-center">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t('home.title')}
            </h1>
          </div>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('home.subtitle')}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2 text-sm">
              <Users className="w-4 h-4" />
              {t('home.stats.users')}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2 text-sm">
              <Star className="w-4 h-4" />
              {t('home.stats.openSource')}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2 text-sm">
              <Clock className="w-4 h-4" />
              {t('home.stats.alwaysOnline')}
            </Badge>
          </div>
          
          <p className="text-lg text-foreground max-w-2xl mx-auto leading-relaxed">
            {t('home.description')}
          </p>
        </div>

        {/* Features Grid with Priority Rating */}
        <div className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 flex flex-col [&>*:first-child]:pt-0">
                  <CardHeader className="px-3 pb-2 flex-shrink-0">
                    <div className="flex items-start justify-between mb-3 mt-1">
                      <div className={`p-2 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/20`}>
                        <Icon className={`w-5 h-5 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant={feature.priority >= 4 ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {feature.badge}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {renderStars(feature.priority)}
                        </div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg mb-2 min-h-[24px]">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed mb-3 line-clamp-2 min-h-[32px]">
                      {feature.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground min-h-[20px]">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {feature.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {feature.usage}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-3 pt-0 flex-1 flex flex-col justify-end">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Prioridade:</span>
                        <span className="font-medium">{getPriorityLabel(feature.priority)}</span>
                      </div>
                      
                      <Link to={feature.path} className="block">
                        <Button className="w-full group-hover:scale-105 transition-transform">
                          <Rocket className="w-4 h-4 mr-2" />
                          Experimentar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">{t('home.benefits.title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {benefits.map((benefit) => (
                 <div key={benefit} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                   <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                   <span className="text-sm text-muted-foreground leading-relaxed">{benefit}</span>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>

        {/* Author Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="text-muted-foreground">
                  {t('home.author.message')}
                </span>
              </div>
              
              <Separator className="w-32" />
              
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{t('home.author.author')}</span>
                  <span className="font-medium">{t('home.author.name')}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <a 
                    href="https://github.com/tiagovilasboas" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    @tiagovilasboas
                  </a>
                  
                  <a 
                    href="https://linkedin.com/in/tiagovilasboas" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    tiagovilasboas
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 