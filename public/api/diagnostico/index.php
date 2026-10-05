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

// Read raw body
$rawInput = file_get_contents('php://input');
$formData = json_decode($rawInput, true);

if (!$formData || !is_array($formData)) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_json', 'message' => 'Dados inválidos enviados no corpo da requisição.']);
    exit;
}

// 1. Process Mini-Briefing submission directly via PHP mail()
if (isset($formData['summaryText']) || isset($formData['protocol'])) {
    $protocol = htmlspecialchars($formData['protocol'] ?? ('LUM-' . date('Ymd') . '-' . rand(1000, 9999)));
    $clientEmail = filter_var($formData['formData']['contactEmail'] ?? $formData['clientEmail'] ?? '', FILTER_SANITIZE_EMAIL);
    $businessName = htmlspecialchars($formData['formData']['businessName'] ?? $formData['businessName'] ?? 'Empresa');
    $contactName = htmlspecialchars($formData['formData']['contactName'] ?? 'Responsável');
    $summary = $formData['summaryText'] ?? 'Mini-briefing recebido.';

    $toCompany = 'atendimento@lumenmarketing.online';
    $senderName = 'Atendimento Lumen';

    function encMime($str) {
        return '=?UTF-8?B?' . base64_encode($str) . '?=';
    }

    $subjectCompany = encMime("[Novo Mini-Briefing] " . $businessName . " (" . $protocol . ")");
    $headersCompany = "From: " . encMime($senderName) . " <" . $toCompany . ">\r\n"
                    . "Reply-To: " . ($clientEmail ? $clientEmail : $toCompany) . "\r\n"
                    . "MIME-Version: 1.0\r\n"
                    . "Content-Type: text/plain; charset=UTF-8\r\n"
                    . "X-Mailer: Lumen PHP Mailer 2.0\r\n";

    @mail($toCompany, $subjectCompany, $summary, $headersCompany);

    if ($clientEmail) {
        $subjectClient = encMime("Confirmação de Recebimento - Mini-Briefing Lumen (" . $protocol . ")");
        $clientMsg = "Olá, " . $contactName . "!\n\nConfirmamos o recebimento com sucesso do seu Mini-Briefing Estratégico na Lumen Agência Virtual (Protocolo: " . $protocol . ").\n\nNossa equipe de estratégia e curadoria já iniciou o estudo do seu segmento e desafios. Entraremos em contato em até 24 horas úteis com o direcionamento personalizado para " . $businessName . ".\n\nCópia dos dados enviados:\n\n" . $summary . "\n\nAtenciosamente,\nAtendimento Lumen\natendimento@lumenmarketing.online";
        $headersClient = "From: " . encMime($senderName) . " <" . $toCompany . ">\r\n"
                       . "Reply-To: " . encMime($senderName) . " <" . $toCompany . ">\r\n"
                       . "MIME-Version: 1.0\r\n"
                       . "Content-Type: text/plain; charset=UTF-8\r\n"
                       . "X-Mailer: Lumen PHP Mailer 2.0\r\n";
        @mail($clientEmail, $subjectClient, $clientMsg, $headersClient);
    }

    echo json_encode([
        'success' => true,
        'protocol' => $protocol,
        'sender' => $senderName . ' <' . $toCompany . '>',
        'message' => 'Mini-briefing encaminhado com sucesso com a máscara Atendimento Lumen.'
    ]);
    exit;
}

// Validation
if (empty($formData['businessName']) || empty($formData['segment']) || empty($formData['whatItDoes'])) {
    http_response_code(400);
    echo json_encode(['error' => 'validation_error', 'message' => 'Preencha os campos obrigatórios do Passo 1.']);
    exit;
}

if (empty($formData['postingFrequency']) || empty($formData['monthlyInvestment'])) {
    http_response_code(400);
    echo json_encode(['error' => 'validation_error', 'message' => 'Preencha os campos obrigatórios do Passo 2.']);
    exit;
}

if (empty($formData['mainGoal']) || empty($formData['mainDifficulty']) || empty($formData['contactEmail']) || empty($formData['lgpdConsent'])) {
    http_response_code(400);
    echo json_encode(['error' => 'validation_error', 'message' => 'Preencha os campos obrigatórios do Passo 3.']);
    exit;
}

// Retrieve Gemini API Key from environment or local .env
$apiKey = getenv('GEMINI_API_KEY');
if (!$apiKey && isset($_SERVER['GEMINI_API_KEY'])) {
    $apiKey = $_SERVER['GEMINI_API_KEY'];
}
if (!$apiKey && isset($_ENV['GEMINI_API_KEY'])) {
    $apiKey = $_ENV['GEMINI_API_KEY'];
}

// Fallback: check .env file in parent directories
if (!$apiKey) {
    $envPaths = [__DIR__ . '/../../.env', __DIR__ . '/../../../.env'];
    foreach ($envPaths as $p) {
        if (file_exists($p)) {
            $lines = file($p, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                if (strpos($line, 'GEMINI_API_KEY=') === 0) {
                    $parts = explode('=', $line, 2);
                    $apiKey = trim($parts[1], " \"'\r\n");
                    break 2;
                }
            }
        }
    }
}

if (!$apiKey || $apiKey === 'MY_GEMINI_API_KEY') {
    http_response_code(500);
    echo json_encode([
        'error' => 'missing_api_key',
        'message' => 'A chave GEMINI_API_KEY não foi configurada nas variáveis de ambiente do servidor.'
    ]);
    exit;
}

// Build Prompt
$businessName = htmlspecialchars($formData['businessName'] ?? 'Não informado');
$whatItDoes = htmlspecialchars($formData['whatItDoes'] ?? 'Não informado');
$segment = htmlspecialchars($formData['segment'] ?? 'Não informado');
$targetAudience = htmlspecialchars($formData['targetAudience'] ?? 'Não especificado');
$city = htmlspecialchars($formData['city'] ?? 'Não informada');
$channels = is_array($formData['currentChannels'] ?? null) ? implode(', ', $formData['currentChannels']) : 'Nenhum';
$frequency = htmlspecialchars($formData['postingFrequency'] ?? 'Não informada');
$investment = htmlspecialchars($formData['monthlyInvestment'] ?? 'Não informado');
$priceRange = htmlspecialchars($formData['priceRange'] ?? 'Não informada');
$mainGoal = htmlspecialchars($formData['mainGoal'] ?? 'Crescimento geral');
$mainDifficulty = htmlspecialchars($formData['mainDifficulty'] ?? 'Não informada');

$prompt = "Você é um estrategista sênior de marketing da agência Lumen. Com base nos dados reais informados por um cliente potencial, produza um diagnóstico específico para o negócio dele — nunca genérico ou aplicável a qualquer empresa do mesmo segmento.\n\n"
    . "Dados do negócio:\n"
    . "- Nome: {$businessName}\n"
    . "- O que faz: {$whatItDoes}\n"
    . "- Segmento: {$segment}\n"
    . "- Público-alvo: {$targetAudience}\n"
    . "- Cidade/região: {$city}\n"
    . "- Canais ativos: {$channels}\n"
    . "- Frequência de publicação/anúncio: {$frequency}\n"
    . "- Investimento mensal atual: {$investment}\n"
    . "- Faixa de preço do produto/serviço: {$priceRange}\n"
    . "- Objetivo prioritário: {$mainGoal}\n"
    . "- Maior dificuldade relatada: {$mainDifficulty}\n\n"
    . "Responda APENAS com um JSON no formato:\n"
    . "{\n"
    . "  \"notaGeral\": número de 0 a 100,\n"
    . "  \"notasPorPilar\": {\n"
    . "    \"estrategico\": número de 0 a 100,\n"
    . "    \"digital\": número de 0 a 100,\n"
    . "    \"publicidade\": número de 0 a 100,\n"
    . "    \"comunicacao\": número de 0 a 100\n"
    . "  },\n"
    . "  \"pontosFortes\": [até 3 strings curtas, específicas ao que foi informado],\n"
    . "  \"oportunidades\": [até 3 strings curtas, específicas, nunca genéricas],\n"
    . "  \"sloganSugerido\": \"string\",\n"
    . "  \"produtoRecomendado\": \"slug de um produto do catálogo da Lumen\",\n"
    . "  \"motivoRecomendacao\": \"string de 1 a 2 frases, citando algo que o cliente informou\"\n"
    . "}\n\n"
    . "O campo 'produtoRecomendado' DEVE ser estritamente um destes slugs:\n"
    . "- 'diagnostico-plano-estrategico'\n"
    . "- 'identidade-visual'\n"
    . "- 'pack-artes-redes-sociais'\n"
    . "- 'video-de-campanha'\n"
    . "- 'landing-page'\n"
    . "- 'lumen-continuo'";

$models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
$lastResponse = null;
$parsed = null;

foreach ($models as $model) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key=" . urlencode($apiKey);

    $payload = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ],
        'generationConfig' => [
            'responseMimeType' => 'application/json',
            'temperature' => 0.35
        ]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $raw = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $raw) {
        $json = json_decode($raw, true);
        $candidateText = $json['candidates'][0]['content']['parts'][0]['text'] ?? '';
        if ($candidateText) {
            $parsed = json_decode($candidateText, true);
            if ($parsed && isset($parsed['notaGeral'])) {
                break;
            }
        }
    } else {
        $lastResponse = $raw;
    }
}

if (!$parsed || !isset($parsed['notaGeral'])) {
    http_response_code(503);
    echo json_encode([
        'error' => 'ai_service_unavailable',
        'message' => 'Não foi possível gerar a análise com a inteligência artificial neste momento.',
        'details' => $lastResponse ? json_decode($lastResponse, true) : null
    ]);
    exit;
}

$validSlugs = [
    'diagnostico-plano-estrategico',
    'identidade-visual',
    'pack-artes-redes-sociais',
    'video-de-campanha',
    'landing-page',
    'lumen-continuo'
];

$recSlug = trim(strtolower($parsed['produtoRecomendado'] ?? ''));
if (!in_array($recSlug, $validSlugs)) {
    $recSlug = 'diagnostico-plano-estrategico';
}

$response = [
    'notaGeral' => max(0, min(100, (int)$parsed['notaGeral'])),
    'notasPorPilar' => [
        'estrategico' => max(0, min(100, (int)($parsed['notasPorPilar']['estrategico'] ?? 50))),
        'digital' => max(0, min(100, (int)($parsed['notasPorPilar']['digital'] ?? 50))),
        'publicidade' => max(0, min(100, (int)($parsed['notasPorPilar']['publicidade'] ?? 50))),
        'comunicacao' => max(0, min(100, (int)($parsed['notasPorPilar']['comunicacao'] ?? 50))),
    ],
    'pontosFortes' => array_slice($parsed['pontosFortes'] ?? [], 0, 3),
    'oportunidades' => array_slice($parsed['oportunidades'] ?? [], 0, 3),
    'sloganSugerido' => (string)($parsed['sloganSugerido'] ?? ''),
    'produtoRecomendado' => $recSlug,
    'motivoRecomendacao' => (string)($parsed['motivoRecomendacao'] ?? ''),
    'businessName' => $formData['businessName'],
    'segment' => $formData['segment'],
    'whatItDoes' => $formData['whatItDoes'],
    'contactEmail' => $formData['contactEmail'],
    'generatedAt' => date('c'),
    'isAIGenerated' => true
];

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
