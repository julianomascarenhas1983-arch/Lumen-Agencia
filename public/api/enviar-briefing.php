<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method_not_allowed', 'message' => 'Método não permitido']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_json', 'message' => 'Dados inválidos']);
    exit;
}

$formData = isset($data['formData']) ? $data['formData'] : $data;
$protocol = htmlspecialchars($data['protocol'] ?? $formData['protocol'] ?? ('LUM-' . date('Ymd') . '-' . rand(1000, 9999)));

$businessName = htmlspecialchars($formData['businessName'] ?? 'Empresa');
$contactName = htmlspecialchars($formData['contactName'] ?? 'Responsável');
$segment = htmlspecialchars($formData['segment'] ?? 'Não informado');
$whatItDoes = htmlspecialchars($formData['whatItDoes'] ?? 'Não informado');
$targetAudience = htmlspecialchars($formData['targetAudience'] ?? 'Não informado');
$city = htmlspecialchars($formData['city'] ?? 'Não informada');
$channels = is_array($formData['currentChannels'] ?? null) ? implode(', ', $formData['currentChannels']) : htmlspecialchars($formData['currentChannels'] ?? 'Não informado');
$postingFrequency = htmlspecialchars($formData['postingFrequency'] ?? 'Não informada');
$monthlyInvestment = htmlspecialchars($formData['monthlyInvestment'] ?? 'Não informado');
$priceRange = htmlspecialchars($formData['priceRange'] ?? 'Não informado');
$mainGoal = htmlspecialchars($formData['mainGoal'] ?? 'Não informado');
$mainDifficulty = htmlspecialchars($formData['mainDifficulty'] ?? 'Não informado');
$urgency = htmlspecialchars($formData['urgency'] ?? 'Imediato (15 a 30 dias)');
$clientEmail = filter_var($formData['contactEmail'] ?? '', FILTER_SANITIZE_EMAIL);
$clientPhone = htmlspecialchars($formData['contactPhone'] ?? 'Não informado');

$companyEmail = 'atendimento@lumenmarketing.online';
$senderName = 'Atendimento Lumen';

// Helper for MIME encoded headers
function encodeHeader($string) {
    return '=?UTF-8?B?' . base64_encode($string) . '?=';
}

// 1. Template HTML para o Solicitante (Confirmação)
$htmlClient = '<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Confirmação de Mini-Briefing</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070A17; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #F3F1EA;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A17; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #0C1226; border-radius: 20px; border: 1px solid rgba(246,196,83,0.3); overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
          
          <!-- Top bar -->
          <tr>
            <td style="height: 3px; background: linear-gradient(90deg, #19D3F3, #F6C453, #FF2E93);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 35px 35px 25px 35px; text-align: center;">
              <div style="font-size: 24px; font-weight: 800; color: #F3F1EA; letter-spacing: -0.5px;">
                Lumen <span style="font-size: 13px; font-weight: 400; color: #98A1BC; text-transform: uppercase; letter-spacing: 2px; margin-left: 8px;">Agência Virtual</span>
              </div>
              <div style="color: #F6C453; font-size: 13px; font-weight: 600; margin-top: 4px;">
                Marcas que se fazem ver.
              </div>
            </td>
          </tr>

          <!-- Badge Protocolo -->
          <tr>
            <td align="center" style="padding: 0 35px 20px 35px;">
              <div style="display: inline-block; background-color: #070A17; border: 1px solid rgba(246,196,83,0.4); padding: 8px 18px; border-radius: 12px; font-size: 13px; font-weight: bold; color: #F6C453; font-family: monospace;">
                PROTOCOLO: ' . $protocol . '
              </div>
            </td>
          </tr>

          <!-- Mensagem Principal -->
          <tr>
            <td style="padding: 0 35px 25px 35px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #F3F1EA; margin: 0 0 12px 0;">
                Olá, ' . $contactName . '!
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #98A1BC; margin: 0 0 15px 0;">
                Confirmamos o recebimento do <strong style="color: #F3F1EA;">Mini-Briefing Estratégico</strong> da sua empresa <strong style="color: #F6C453;">' . $businessName . '</strong>.
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #98A1BC; margin: 0 0 20px 0;">
                Nossa equipe de estratégia e curadoria já iniciou o estudo do seu segmento e desafios. Entraremos em contato com você em até <strong style="color: #F3F1EA;">24 horas úteis</strong> com o seu plano de ação personalizado.
              </p>
            </td>
          </tr>

          <!-- Resumo dos Dados -->
          <tr>
            <td style="padding: 0 35px 30px 35px;">
              <div style="background-color: #070A17; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px;">
                <div style="font-size: 12px; font-weight: 700; color: #F6C453; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                  Cópia dos Dados Registrados:
                </div>
                <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 13px;">
                  <tr><td width="35%" style="color: #98A1BC;">Empresa:</td><td style="color: #F3F1EA; font-weight: 600;">' . $businessName . '</td></tr>
                  <tr><td style="color: #98A1BC;">Segmento:</td><td style="color: #F3F1EA;">' . $segment . '</td></tr>
                  <tr><td style="color: #98A1BC;">O que faz:</td><td style="color: #F3F1EA;">' . $whatItDoes . '</td></tr>
                  <tr><td style="color: #98A1BC;">Objetivo:</td><td style="color: #F3F1EA;">' . $mainGoal . '</td></tr>
                  <tr><td style="color: #98A1BC;">Dificuldade:</td><td style="color: #F3F1EA;">' . $mainDifficulty . '</td></tr>
                  <tr><td style="color: #98A1BC;">Investimento:</td><td style="color: #F3F1EA;">' . $monthlyInvestment . '</td></tr>
                  <tr><td style="color: #98A1BC;">WhatsApp:</td><td style="color: #F3F1EA;">' . $clientPhone . '</td></tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Botão WhatsApp -->
          <tr>
            <td align="center" style="padding: 0 35px 35px 35px;">
              <a href="https://wa.me/5511998421080?text=Ol%C3%A1%20Lumen!%20Enviei%20meu%20Mini-Briefing%20(Protocolo:%20' . $protocol . ')" style="display: inline-block; background-color: #10B981; color: #070A17; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 20px rgba(16,185,129,0.3);">
                Falar Agora via WhatsApp &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #050711; padding: 25px 35px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #98A1BC;">
              <p style="margin: 0 0 6px 0;"><strong>Lumen Agência Virtual</strong> &bull; atendimento@lumenmarketing.online</p>
              <p style="margin: 0; font-size: 11px; opacity: 0.7;">Você recebeu esta mensagem porque submeteu um Mini-Briefing em lumenmarketing.online em conformidade com a LGPD.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

// 2. Template HTML para a Empresa (Lumen)
$htmlCompany = '<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Novo Mini-Briefing Recebido</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070A17; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #F3F1EA;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070A17; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #0C1226; border-radius: 20px; border: 1px solid rgba(25,211,243,0.3); overflow: hidden;">
          
          <tr><td style="height: 3px; background: linear-gradient(90deg, #19D3F3, #F6C453);"></td></tr>

          <tr>
            <td style="padding: 30px 35px 20px 35px;">
              <div style="font-size: 12px; font-weight: 700; color: #19D3F3; text-transform: uppercase; letter-spacing: 2px;">
                NOVO LEAD QUALIFICADO // MINI-BRIEFING
              </div>
              <h1 style="font-size: 22px; font-weight: 800; color: #F3F1EA; margin: 8px 0 0 0;">
                ' . $businessName . ' (' . $segment . ')
              </h1>
              <div style="font-family: monospace; font-size: 13px; color: #F6C453; margin-top: 6px;">
                Protocolo: ' . $protocol . ' &bull; ' . date('d/m/Y H:i') . '
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 35px 30px 35px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="8" style="background-color: #070A17; border-radius: 14px; font-size: 13px; border: 1px solid rgba(255,255,255,0.06);">
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td width="35%" style="color: #98A1BC;">Responsável:</td><td style="color: #F3F1EA; font-weight: 600;">' . $contactName . '</td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">E-mail:</td><td style="color: #19D3F3;"><a href="mailto:' . $clientEmail . '" style="color: #19D3F3;">' . $clientEmail . '</a></td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">WhatsApp:</td><td style="color: #10B981; font-weight: bold;">' . $clientPhone . '</td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">Cidade/Estado:</td><td style="color: #F3F1EA;">' . $city . '</td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">O que faz:</td><td style="color: #F3F1EA;">' . $whatItDoes . '</td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">Público-alvo:</td><td style="color: #F3F1EA;">' . $targetAudience . '</td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">Canais Atuais:</td><td style="color: #F3F1EA;">' . $channels . '</td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">Frequência:</td><td style="color: #F3F1EA;">' . $postingFrequency . '</td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">Investimento:</td><td style="color: #F6C453; font-weight: 600;">' . $monthlyInvestment . '</td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">Ticket Médio:</td><td style="color: #F3F1EA;">' . $priceRange . '</td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">Objetivo:</td><td style="color: #F3F1EA; font-weight: 600;">' . $mainGoal . '</td></tr>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="color: #98A1BC;">Maior Gargalo:</td><td style="color: #FF5A87;">' . $mainDifficulty . '</td></tr>
                <tr><td style="color: #98A1BC;">Urgência:</td><td style="color: #F3F1EA;">' . $urgency . '</td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 0 35px 35px 35px;">
              <a href="mailto:' . $clientEmail . '?subject=' . rawurlencode('[Lumen] Retorno do seu Mini-Briefing - ' . $businessName . ' (' . $protocol . ')') . '" style="display: inline-block; background-color: #F6C453; color: #070A17; text-decoration: none; font-weight: 800; font-size: 13px; padding: 12px 24px; border-radius: 10px; margin-right: 10px;">
                Responder por E-mail
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

// Headers com máscara oficial: "Atendimento Lumen <atendimento@lumenmarketing.online>"
$subjectCompany = encodeHeader("[Novo Mini-Briefing] " . $businessName . " (" . $protocol . ")");
$headersCompany = "From: " . encodeHeader($senderName) . " <" . $companyEmail . ">\r\n"
                . "Reply-To: " . encodeHeader($contactName) . " <" . $clientEmail . ">\r\n"
                . "MIME-Version: 1.0\r\n"
                . "Content-Type: text/html; charset=UTF-8\r\n"
                . "X-Mailer: Lumen PHP Mailer 2.0\r\n";

$companySent = @mail($companyEmail, $subjectCompany, $htmlCompany, $headersCompany);

$clientSent = false;
if ($clientEmail) {
    $subjectClient = encodeHeader("Confirmação de Recebimento - Mini-Briefing Lumen (" . $protocol . ")");
    $headersClient = "From: " . encodeHeader($senderName) . " <" . $companyEmail . ">\r\n"
                   . "Reply-To: " . encodeHeader($senderName) . " <" . $companyEmail . ">\r\n"
                   . "MIME-Version: 1.0\r\n"
                   . "Content-Type: text/html; charset=UTF-8\r\n"
                   . "X-Mailer: Lumen PHP Mailer 2.0\r\n";
    $clientSent = @mail($clientEmail, $subjectClient, $htmlClient, $headersClient);
}

echo json_encode([
    'success' => true,
    'protocol' => $protocol,
    'sender' => $senderName . ' <' . $companyEmail . '>',
    'companySent' => $companySent,
    'clientSent' => $clientSent,
    'message' => 'Mini-briefing processado e enviado via Atendimento Lumen.'
]);
