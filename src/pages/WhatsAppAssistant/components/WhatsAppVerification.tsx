
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useWhatsAppIntegration } from '@/hooks/useWhatsAppIntegration';
import { Label } from '@/components/ui/label';
import { Phone, Check, CheckCircle2, AlertCircle } from 'lucide-react';

export function WhatsAppVerification() {
  const [newPhone, setNewPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const {
    phoneNumber,
    isVerified,
    isVerifying,
    updatePhoneNumber,
    sendVerificationCode,
    verifyCode
  } = useWhatsAppIntegration();

  const handleUpdatePhone = async () => {
    const success = await updatePhoneNumber(newPhone);
    if (success) {
      setIsEditing(false);
      setIsVerificationMode(true);
    }
  };

  const handleSendVerification = async () => {
    const success = await sendVerificationCode();
    if (success) {
      setIsVerificationMode(true);
    }
  };

  const handleVerifyCode = async () => {
    const success = await verifyCode(verificationCode);
    if (success) {
      setIsVerificationMode(false);
      setVerificationCode('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Verificação de WhatsApp
        </CardTitle>
        <CardDescription>
          Verifique seu número de WhatsApp para receber notificações
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isVerified ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <AlertTitle className="text-green-700">WhatsApp Verificado</AlertTitle>
            <AlertDescription className="text-green-600">
              Seu número de WhatsApp foi verificado e está pronto para receber notificações.
            </AlertDescription>
          </Alert>
        ) : phoneNumber && !isEditing ? (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-700">Verificação Pendente</AlertTitle>
            <AlertDescription className="text-amber-600">
              Seu número {phoneNumber} ainda não foi verificado. Verifique-o para receber notificações via WhatsApp.
            </AlertDescription>
          </Alert>
        ) : !phoneNumber && !isEditing ? (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <AlertTitle className="text-blue-700">Adicione seu WhatsApp</AlertTitle>
            <AlertDescription className="text-blue-600">
              Adicione seu número de WhatsApp para receber notificações importantes.
            </AlertDescription>
          </Alert>
        ) : null}

        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="phone">Número de WhatsApp</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Digite apenas números, incluindo o DDD.
            </p>
          </div>
        ) : isVerificationMode ? (
          <div className="space-y-2">
            <Label htmlFor="verification-code">Código de Verificação</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <p className="text-xs text-muted-foreground">
              Digite o código de 6 dígitos enviado para seu WhatsApp.
            </p>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
        {!isEditing && !isVerificationMode ? (
          <>
            {phoneNumber ? (
              <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditing(true)}>
                  Alterar número
                </Button>
                <Button className="flex-1" onClick={handleSendVerification} disabled={isVerified || isVerifying}>
                  {isVerifying ? 'Enviando...' : 'Verificar número'}
                </Button>
              </div>
            ) : (
              <Button className="w-full" onClick={() => setIsEditing(true)}>
                Adicionar número
              </Button>
            )}
          </>
        ) : isEditing ? (
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleUpdatePhone}
              disabled={!newPhone || newPhone.length < 10}
            >
              Salvar
            </Button>
          </div>
        ) : isVerificationMode ? (
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1" onClick={() => {
              setIsVerificationMode(false);
              setVerificationCode('');
            }}>
              Cancelar
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6 || isVerifying}
            >
              {isVerifying ? 'Verificando...' : 'Confirmar código'}
            </Button>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
}
