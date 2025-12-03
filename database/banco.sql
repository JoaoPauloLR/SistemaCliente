-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 03/11/2025 às 16:47
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `banco`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `aparelho`
--

CREATE TABLE `aparelho` (
  `codigo` bigint(20) NOT NULL,
  `nome` varchar(20) NOT NULL,
  `marca` varchar(20) DEFAULT NULL,
  `modelo` varchar(20) DEFAULT NULL,
  `serie` varchar(20) DEFAULT NULL,
  `defeito` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `aparelho`
--

INSERT INTO `aparelho` (`codigo`, `nome`, `marca`, `modelo`, `serie`, `defeito`) VALUES
(1757800000020, 'Smartphone', 'Samsung', 'Galaxy S23', NULL, 'Tela não liga'),
(1757800000021, 'Notebook', 'Dell', 'Vostro 3400', NULL, 'Lento e superaquecendo'),
(1757800000022, 'iPhone', 'Apple', 'iPhone 13', NULL, 'Bateria viciada'),
(1757800000023, 'Tablet', 'Samsung', 'Tab A7', NULL, 'Conector de carga quebrado'),
(1757800000024, 'Smartphone', 'Motorola', 'Edge 30', NULL, 'Câmera não foca'),
(1757800000025, 'Notebook', 'HP', '246 G8', NULL, 'Teclado falhando algumas teclas'),
(1757800000026, 'iPhone', 'Apple', 'iPhone 11', NULL, 'Vidro traseiro trincado'),
(1757800000027, 'Smartphone', 'Xiaomi', 'Redmi Note 11', NULL, 'Não reconhece chip'),
(1757800000028, 'Notebook', 'Lenovo', 'Ideapad S145', NULL, 'Tela com listras verticais'),
(1757800000029, 'iPhone', 'Apple', 'iPhone XR', NULL, 'Não sai som no alto-falante'),
(1757800000030, 'Smartphone', 'Samsung', 'Galaxy A54', NULL, 'Molhou e não liga mais'),
(1757800000031, 'Notebook', 'Acer', 'Aspire 5', NULL, 'Upgrade de memória e SSD'),
(1757800000032, 'iPhone', 'Apple', 'iPhone 14 Pro', NULL, 'Face ID não funciona'),
(1757800000033, 'Tablet', 'Multilaser', 'M10', NULL, 'Loop infinito na inicialização'),
(1757800000034, 'Smartphone', 'Samsung', 'Galaxy M52', NULL, 'Mancha roxa na tela'),
(1757800000035, 'Notebook', 'Positivo', 'Motion Q464B', NULL, 'Formatação e instalação do Windows'),
(1757800000036, 'iPhone', 'Apple', 'iPhone 12', NULL, 'Botão de volume emperrado'),
(1757800000037, 'Smartphone', 'Motorola', 'Moto G22', NULL, 'Wi-Fi não conecta'),
(1757800000038, 'Notebook', 'Samsung', 'Book E30', NULL, 'Dobradiça da tela quebrada'),
(1757800000039, 'iPhone', 'Apple', 'iPhone 8 Plus', NULL, 'Botão home não funciona'),
(1757800000040, 'Smartphone', 'LG', 'K52', NULL, 'Desligando sozinho'),
(1757800000041, 'Notebook', 'Dell', 'Latitude 5490', NULL, 'Não carrega'),
(1757800000042, 'iPhone', 'Apple', 'iPhone SE 2020', NULL, 'Troca de tela'),
(1757800000043, 'Tablet', 'Apple', 'iPad 9', NULL, 'Tela trincada'),
(1757800000044, 'Smartphone', 'Xiaomi', 'Poco X5', NULL, 'Áudio baixo em ligações'),
(1757800000045, 'Notebook', 'HP', 'Pavilion 15', NULL, 'Limpeza interna e troca de pasta térmica'),
(1757800000046, 'iPhone', 'Apple', 'iPhone 13 Mini', NULL, 'Câmera traseira não abre'),
(1757800000047, 'Smartphone', 'Realme', 'C55', NULL, 'Entrada de fone não funciona'),
(1757800000048, 'Notebook', 'Lenovo', 'ThinkPad T14', NULL, 'Instalação de Linux'),
(1757800000049, 'Smartphone', 'Asus', 'Zenfone 9', NULL, 'Sensor de proximidade com defeito'),
(1757800000050, 'Smartphone', 'Samsung', 'Galaxy S21 FE', NULL, 'Superaquecimento'),
(1757800000051, 'Notebook', 'Dell', 'XPS 13', NULL, 'Bateria estufada'),
(1757800000052, 'iPhone', 'Apple', 'iPhone 12 Pro Max', NULL, 'Tela verde'),
(1757800000053, 'Tablet', 'Samsung', 'Tab S6 Lite', NULL, 'Caneta S-Pen não funciona'),
(1757800000054, 'Smartphone', 'Motorola', 'Moto G82', NULL, 'GPS não localiza'),
(1757800000055, 'Notebook', 'HP', 'ProBook 440', NULL, 'Leitor biométrico parou de funcionar'),
(1757800000056, 'iPhone', 'Apple', 'iPhone 14', NULL, 'Câmera frontal com mancha'),
(1757800000057, 'Smartphone', 'Xiaomi', 'Redmi 10', NULL, 'Aparelho não vibra'),
(1757800000058, 'Notebook', 'Acer', 'Nitro 5', NULL, 'Uma das ventoinhas fazendo barulho'),
(1757800000059, 'iPhone', 'Apple', 'iPhone X', NULL, 'Toque fantasma na tela'),
(1757800000060, 'Smartphone', 'Samsung', 'Galaxy Z Flip 4', NULL, 'Tela dobrável com vinco aparente'),
(1757800000061, 'Notebook', 'MacBook Air', 'Apple', NULL, 'Trackpad não clica'),
(1757800000062, 'iPhone', 'Apple', 'iPhone 15', NULL, 'Não ativa o chip virtual (eSIM)'),
(1757800000063, 'Tablet', 'Amazon', 'Fire HD 10', NULL, 'Não sai da tela inicial da Amazon'),
(1757800000064, 'Smartphone', 'Google', 'Pixel 7a', NULL, 'Leitor de digital na tela falha muito'),
(1757800000065, 'Notebook', 'MSI', 'Katana GF66', NULL, 'Tela não dá vídeo'),
(1757800000066, 'iPhone', 'Apple', 'iPhone 13 Pro', NULL, 'Modo silencioso não ativa'),
(1757800000067, 'Smartphone', 'Nokia', 'G60', NULL, 'Slot de cartão de memória não reconhece'),
(1757800000068, 'Notebook', 'MacBook Pro', 'Apple', NULL, 'Touch Bar apagada'),
(1757800000069, 'Smartphone', 'OnePlus', '11', NULL, 'Alerta de umidade no conector');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cidade`
--

CREATE TABLE `cidade` (
  `cod_Ci` int(11) NOT NULL,
  `nome` varchar(30) NOT NULL,
  `UF` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cidade`
--

INSERT INTO `cidade` (`cod_Ci`, `nome`, `UF`) VALUES
(10, 'Ponta Grossa', 'PR'),
(11, 'Curitiba', 'PR'),
(12, 'Carambeí', 'PR'),
(13, 'Castro', 'PR'),
(14, 'Telêmaco Borba', 'PR'),
(15, 'Guarapuava', 'PR'),
(16, 'Irati', 'PR'),
(17, 'Palmeira', 'PR'),
(18, 'Tibagi', 'PR'),
(19, 'Jaguariaíva', 'PR');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `cod_C` int(11) NOT NULL,
  `cod_Ci` int(11) NOT NULL,
  `telefone` varchar(15) DEFAULT NULL,
  `cep` varchar(9) DEFAULT NULL,
  `endereco` varchar(100) DEFAULT NULL,
  `bairro` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cliente`
--

INSERT INTO `cliente` (`cod_C`, `cod_Ci`, `telefone`, `cep`, `endereco`, `bairro`) VALUES
(2, 10, '(93) 99147-4202', NULL, NULL, NULL),
(3, 10, '(42) 99138-8020', NULL, NULL, NULL),
(4, 10, '(42) 99990-9443', NULL, NULL, NULL),
(5, 10, '(42) 99875-9875', NULL, NULL, NULL),
(6, 10, '(42) 99996-2607', NULL, NULL, NULL),
(7, 10, '(42) 99806-0306', NULL, NULL, NULL),
(8, 10, '(42) 99901-5226', NULL, NULL, NULL),
(9, 10, '(42) 99132-7585', NULL, NULL, NULL),
(10, 10, '(42) 99141-8656', NULL, NULL, NULL),
(11, 10, '(42) 99971-8288', NULL, NULL, NULL),
(12, 10, '(42) 98809-5415', NULL, NULL, NULL),
(13, 10, '(42) 99912-3037', NULL, NULL, NULL),
(14, 10, '(42) 99965-9879', NULL, NULL, NULL),
(15, 10, '(42) 99824-7661', NULL, NULL, NULL),
(16, 10, '(42) 99975-4740', NULL, NULL, NULL),
(17, 10, '(42) 99975-6060', NULL, NULL, NULL),
(18, 10, '(42) 99818-6870', NULL, NULL, NULL),
(19, 10, '(42) 99805-7288', NULL, NULL, NULL),
(20, 10, '(42) 99913-7182', NULL, NULL, NULL),
(21, 10, '(42) 99975-1845', NULL, NULL, NULL),
(22, 10, '(42) 99923-0171', NULL, NULL, NULL),
(23, 10, '(42) 99823-3823', NULL, NULL, NULL),
(24, 10, '(42) 99840-0870', NULL, NULL, NULL),
(25, 10, '(42) 98808-1610', NULL, NULL, NULL),
(26, 10, '(42) 99905-5915', NULL, NULL, NULL),
(27, 10, '(42) 98811-1250', NULL, NULL, NULL),
(28, 10, '(42) 99806-7313', NULL, NULL, NULL),
(29, 10, '(42) 99105-0105', NULL, NULL, NULL),
(30, 10, '(42) 99972-7300', NULL, NULL, NULL),
(31, 10, '(42) 99901-7650', NULL, NULL, NULL),
(32, 10, '(42) 99981-8079', NULL, NULL, NULL),
(33, 10, '(42) 99841-4008', NULL, NULL, NULL),
(34, 10, '(42) 99923-3112', NULL, NULL, NULL),
(35, 10, '(42) 99107-1300', NULL, NULL, NULL),
(36, 10, '(42) 99128-4060', NULL, NULL, NULL),
(37, 10, '(42) 99914-1180', NULL, NULL, NULL),
(38, 10, '(42) 99941-8641', NULL, NULL, NULL),
(39, 10, '(42) 99127-1049', NULL, NULL, NULL),
(40, 10, '(42) 99151-5182', NULL, NULL, NULL),
(41, 10, '(42) 99943-4114', NULL, NULL, NULL),
(42, 10, '(42) 99933-4148', NULL, NULL, NULL),
(43, 10, '(42) 99938-1218', NULL, NULL, NULL),
(44, 10, '(42) 99806-0306', NULL, NULL, NULL),
(45, 10, '(42) 99907-8051', NULL, NULL, NULL),
(46, 10, '(42) 99138-0382', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `funcionario`
--

CREATE TABLE `funcionario` (
  `cod_F` int(11) NOT NULL,
  `login` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `funcionario`
--

INSERT INTO `funcionario` (`cod_F`, `login`, `senha`) VALUES
(1, 'admin', '$2b$10$91JDybLP5kzOGEgA7z3q5OzIv7w3bKwZeadf9yfWII318r1Ti.jFK');

-- --------------------------------------------------------

--
-- Estrutura para tabela `ordemdeservico`
--

CREATE TABLE `ordemdeservico` (
  `cod_Os` int(11) NOT NULL,
  `cod_C` int(11) NOT NULL,
  `cod_F` int(11) NOT NULL,
  `cod_Ci` int(11) NOT NULL,
  `cod_S` int(11) NOT NULL,
  `codigo` bigint(20) NOT NULL,
  `dataEntrada` date NOT NULL,
  `dataSaida` date DEFAULT NULL,
  `observacao` varchar(200) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Aberto'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `ordemdeservico`
--

INSERT INTO `ordemdeservico` (`cod_Os`, `cod_C`, `cod_F`, `cod_Ci`, `cod_S`, `codigo`, `dataEntrada`, `dataSaida`, `observacao`, `status`) VALUES
(1, 2, 1, 10, 20, 1757800000020, '2025-10-07', '2025-10-15', NULL, 'Fechado'),
(2, 3, 1, 10, 21, 1757800000021, '2025-10-07', '2025-10-13', NULL, 'Fechado'),
(3, 4, 1, 10, 22, 1757800000022, '2025-10-07', '2025-10-10', NULL, 'Fechado'),
(4, 5, 1, 10, 23, 1757800000023, '2025-10-07', '2025-10-14', NULL, 'Fechado'),
(5, 6, 1, 10, 24, 1757800000024, '2025-10-08', '2025-10-13', NULL, 'Fechado'),
(6, 7, 1, 10, 25, 1757800000025, '2025-10-09', '2025-10-14', NULL, 'Fechado'),
(7, 8, 1, 10, 26, 1757800000026, '2025-10-10', '2025-10-15', NULL, 'Fechado'),
(8, 9, 1, 10, 27, 1757800000027, '2025-10-10', '2025-10-17', NULL, 'Fechado'),
(9, 10, 1, 10, 28, 1757800000028, '2025-10-10', '2025-10-17', NULL, 'Fechado'),
(10, 11, 1, 10, 29, 1757800000029, '2025-10-13', '2025-10-21', NULL, 'Fechado'),
(11, 12, 1, 10, 30, 1757800000030, '2025-10-13', '2025-10-21', NULL, 'Fechado'),
(12, 13, 1, 10, 31, 1757800000031, '2025-10-13', '2025-10-15', NULL, 'Fechado'),
(13, 14, 1, 10, 32, 1757800000032, '2025-10-13', '2025-10-18', NULL, 'Fechado'),
(14, 15, 1, 10, 33, 1757800000033, '2025-10-13', '2025-10-17', NULL, 'Fechado'),
(15, 16, 1, 10, 34, 1757800000034, '2025-10-13', '2025-10-20', NULL, 'Fechado'),
(16, 17, 1, 10, 35, 1757800000035, '2025-10-14', '2025-10-23', NULL, 'Fechado'),
(17, 13, 1, 10, 36, 1757800000036, '2025-10-15', '2025-10-17', NULL, 'Fechado'),
(18, 18, 1, 10, 37, 1757800000037, '2025-10-15', '2025-10-22', NULL, 'Fechado'),
(19, 19, 1, 10, 38, 1757800000038, '2025-10-16', '2025-10-27', NULL, 'Fechado'),
(20, 19, 1, 10, 39, 1757800000039, '2025-10-16', '2025-10-20', NULL, 'Fechado'),
(21, 20, 1, 10, 40, 1757800000040, '2025-10-17', '2025-10-24', NULL, 'Fechado'),
(22, 21, 1, 10, 41, 1757800000041, '2025-10-17', '2025-10-27', NULL, 'Fechado'),
(23, 16, 1, 10, 42, 1757800000042, '2025-10-17', '2025-10-24', NULL, 'Fechado'),
(24, 22, 1, 10, 43, 1757800000043, '2025-10-17', '2025-10-24', NULL, 'Fechado'),
(25, 23, 1, 10, 44, 1757800000044, '2025-10-20', '2025-10-23', NULL, 'Fechado'),
(26, 24, 1, 10, 45, 1757800000045, '2025-10-20', '2025-10-21', NULL, 'Fechado'),
(27, 22, 1, 10, 46, 1757800000046, '2025-10-20', '2025-10-23', NULL, 'Fechado'),
(28, 25, 1, 10, 47, 1757800000047, '2025-10-21', '2025-10-23', NULL, 'Fechado'),
(29, 26, 1, 10, 48, 1757800000048, '2025-10-22', '2025-10-29', NULL, 'Fechado'),
(30, 25, 1, 10, 49, 1757800000049, '2025-10-22', '2025-10-29', NULL, 'Aguardando Pagamento'),
(31, 27, 1, 10, 50, 1757800000050, '2025-10-22', '2025-10-29', NULL, 'Fechado'),
(32, 28, 1, 10, 51, 1757800000051, '2025-10-23', '2025-10-29', NULL, 'Fechado'),
(33, 29, 1, 10, 52, 1757800000052, '2025-10-24', '2025-10-29', NULL, 'Aguardando Pagamento'),
(34, 30, 1, 10, 53, 1757800000053, '2025-10-24', '2025-10-28', NULL, 'Fechado'),
(35, 31, 1, 10, 54, 1757800000054, '2025-10-24', NULL, NULL, 'Aberto'),
(36, 32, 1, 10, 55, 1757800000055, '2025-10-24', NULL, NULL, 'Aberto'),
(37, 33, 1, 10, 56, 1757800000056, '2025-10-28', NULL, NULL, 'Aguardando Aprovação'),
(38, 20, 1, 10, 57, 1757800000057, '2025-10-29', NULL, NULL, 'Aberto'),
(39, 34, 1, 10, 58, 1757800000058, '2025-10-29', NULL, NULL, 'Aberto'),
(40, 35, 1, 10, 59, 1757800000059, '2025-10-29', NULL, NULL, 'Aguardando Aprovação'),
(41, 36, 1, 10, 60, 1757800000060, '2025-10-30', NULL, NULL, 'Aberto'),
(42, 37, 1, 10, 61, 1757800000061, '2025-10-30', NULL, NULL, 'Aberto'),
(43, 38, 1, 10, 62, 1757800000062, '2025-10-30', NULL, NULL, 'Aberto'),
(44, 16, 1, 10, 63, 1757800000063, '2025-10-13', NULL, NULL, 'Aberto'),
(45, 39, 1, 10, 64, 1757800000064, '2025-10-31', NULL, NULL, 'Aberto'),
(46, 40, 1, 10, 65, 1757800000065, '2025-10-31', NULL, NULL, 'Aberto'),
(47, 25, 1, 10, 66, 1757800000066, '2025-10-31', NULL, NULL, 'Aberto'),
(48, 41, 1, 10, 67, 1757800000067, '2025-11-03', NULL, NULL, 'Aberto'),
(49, 42, 1, 10, 68, 1757800000068, '2025-11-03', NULL, NULL, 'Aberto'),
(50, 43, 1, 10, 69, 1757800000069, '2025-11-03', NULL, NULL, 'Aberto');

--
-- Acionadores `ordemdeservico`
--
DELIMITER $$
CREATE TRIGGER `validar_datas_ordem` BEFORE INSERT ON `ordemdeservico` FOR EACH ROW BEGIN
    IF NEW.dataSaida < NEW.dataEntrada THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A data de saída não pode ser anterior à data de entrada.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `pessoa`
--

CREATE TABLE `pessoa` (
  `cod_P` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pessoa`
--

INSERT INTO `pessoa` (`cod_P`, `nome`) VALUES
(1, 'admin'),
(2, 'Edina'),
(3, 'Sandi'),
(4, 'Marcos Rodolfo'),
(5, 'Geovana dos Santos'),
(6, 'Josias'),
(7, 'Maria Eduarda'),
(8, 'Andre'),
(9, 'Felipe'),
(10, 'Thiago'),
(11, 'Vitor'),
(12, 'Ademir'),
(13, 'Domingos'),
(14, 'Carlos'),
(15, 'Vanessa'),
(16, 'Sergio'),
(17, 'Adriana'),
(18, 'Ana'),
(19, 'João'),
(20, 'Alex Alves Lopes'),
(21, 'Nilton'),
(22, 'Raniele'),
(23, 'Leticia'),
(24, 'Nadia'),
(25, 'Fabio'),
(26, 'Silvia'),
(27, 'Marcos'),
(28, 'Leandro'),
(29, 'Cleonice'),
(30, 'Eduardo'),
(31, 'Tatiane'),
(32, 'Gilberto'),
(33, 'Elaine'),
(34, 'Elias'),
(35, 'Jean'),
(36, 'Luzia'),
(37, 'Isabel'),
(38, 'Cristiane'),
(39, 'Sonia'),
(40, 'Fernando'),
(41, 'Eloina'),
(42, 'Jucelia'),
(43, 'Rosangela'),
(44, 'Valeria'),
(45, 'Luiz'),
(46, 'Jessica');

--
-- Acionadores `pessoa`
--
DELIMITER $$
CREATE TRIGGER `deletar_cliente_quando_pessoa_deletada` AFTER DELETE ON `pessoa` FOR EACH ROW DELETE FROM Cliente WHERE cod_C = OLD.cod_P
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `deletar_funcionario_quando_pessoa_deletada` AFTER DELETE ON `pessoa` FOR EACH ROW DELETE FROM Funcionario WHERE cod_F = OLD.cod_P
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `servico`
--

CREATE TABLE `servico` (
  `cod_S` int(11) NOT NULL,
  `descPecas` varchar(100) DEFAULT NULL,
  `descServico` varchar(200) DEFAULT NULL,
  `valorPecas` decimal(10,2) NOT NULL,
  `valorServico` decimal(10,2) NOT NULL,
  `desconto` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `servico`
--

INSERT INTO `servico` (`cod_S`, `descPecas`, `descServico`, `valorPecas`, `valorServico`, `desconto`, `total`) VALUES
(20, '1x Display AMOLED S23', 'Troca do módulo de tela frontal.', 450.00, 180.00, 50.00, 580.00),
(21, NULL, 'Limpeza interna, troca de pasta térmica e otimização de software.', 0.00, 150.00, 0.00, 150.00),
(22, '1x Bateria Original Apple', 'Substituição da bateria.', 280.00, 100.00, 0.00, 380.00),
(23, '1x Conector USB-C', 'Troca do conector de carga e ressolda na placa.', 80.00, 120.00, 0.00, 200.00),
(24, '1x Módulo de Câmera Traseira', 'Substituição do conjunto de câmeras principal.', 150.00, 130.00, 10.00, 270.00),
(25, '1x Teclado Padrão ABNT2', 'Troca do teclado completo.', 180.00, 100.00, 0.00, 280.00),
(26, '1x Tampa Traseira de Vidro', 'Substituição do vidro traseiro.', 350.00, 150.00, 0.00, 500.00),
(27, NULL, 'Reparo no leitor de SIM card na placa-mãe.', 0.00, 120.00, 0.00, 120.00),
(28, '1x Tela LCD 15.6\"', 'Troca do display LCD do notebook.', 400.00, 200.00, 0.00, 600.00),
(29, '1x Alto-falante auricular', 'Troca do alto-falante superior.', 120.00, 90.00, 0.00, 210.00),
(30, NULL, 'Desoxidação química da placa-mãe e componentes.', 0.00, 300.00, 0.00, 300.00),
(31, '1x SSD 480GB, 1x Pente 8GB DDR4', 'Instalação de SSD e upgrade de memória RAM.', 350.00, 120.00, 0.00, 470.00),
(32, '1x Módulo TrueDepth', 'Troca e reprogramação do módulo de câmera infravermelho.', 500.00, 250.00, 50.00, 700.00),
(33, NULL, 'Reinstalação do firmware de fábrica do aparelho.', 0.00, 100.00, 0.00, 100.00),
(34, '1x Tela Super AMOLED M52', 'Troca de tela completa devido a vazamento do display.', 600.00, 200.00, 0.00, 800.00),
(35, NULL, 'Formatação completa e instalação do Windows 11 com drivers.', 0.00, 140.00, 0.00, 140.00),
(36, '1x Cabo flat de volume', 'Substituição do cabo flat dos botões de volume.', 90.00, 80.00, 0.00, 170.00),
(37, '1x Antena Wi-Fi interna', 'Troca do componente de antena e verificação de software.', 130.00, 110.00, 0.00, 240.00),
(38, 'Carcaça base e superior', 'Reconstrução e reforço das dobradiças na carcaça.', 0.00, 180.00, 20.00, 160.00),
(39, '1x Flex do botão home', 'Substituição do cabo flexível do leitor biométrico.', 150.00, 100.00, 0.00, 250.00),
(40, NULL, 'Análise de software e otimização de bateria.', 0.00, 90.00, 0.00, 90.00),
(41, '1x Conector DC Jack', 'Troca do conector de energia interno.', 110.00, 130.00, 0.00, 240.00),
(42, '1x Tela de Retina para iPhone SE', 'Troca de tela.', 250.00, 120.00, 0.00, 370.00),
(43, '1x Vidro com touchscreen para iPad 9', 'Troca do vidro e digitalizador.', 550.00, 200.00, 50.00, 700.00),
(44, '1x Cápsula de áudio', 'Limpeza e substituição da cápsula auricular.', 70.00, 80.00, 0.00, 150.00),
(45, 'Pasta térmica Arctic MX-4', 'Limpeza completa do sistema de refrigeração e troca de pasta térmica.', 0.00, 160.00, 10.00, 150.00),
(46, '1x Módulo de câmera traseira', 'Substituição do módulo de câmera.', 320.00, 150.00, 0.00, 470.00),
(47, '1x Conector P2', 'Troca do conector de fone de ouvido.', 50.00, 70.00, 0.00, 120.00),
(48, NULL, 'Formatação e instalação do sistema Ubuntu 22.04 LTS.', 0.00, 100.00, 0.00, 100.00),
(49, '1x Sensor de proximidade', 'Troca do sensor de proximidade.', 140.00, 110.00, 0.00, 250.00),
(50, NULL, 'Análise de consumo da placa e verificação de apps.', 0.00, 180.00, 0.00, 180.00),
(51, '1x Bateria para Dell XPS', 'Substituição da bateria e descarte seguro da antiga.', 450.00, 150.00, 0.00, 600.00),
(52, '1x Tela OLED para iPhone 12 Pro Max', 'Troca do display.', 700.00, 250.00, 100.00, 850.00),
(53, '1x Digitalizador S-Pen', 'Troca da camada digitalizadora da tela.', 200.00, 100.00, 0.00, 300.00),
(54, NULL, 'Reparo na antena de GPS e calibração.', 0.00, 130.00, 0.00, 130.00),
(55, '1x Leitor biométrico', 'Troca do componente do leitor de digital.', 180.00, 120.00, 0.00, 300.00),
(56, '1x Lente da câmera frontal', 'Troca do vidro da lente e limpeza do sensor.', 400.00, 180.00, 30.00, 550.00),
(57, '1x Motor de vibração', 'Substituição do motor vibra call.', 60.00, 80.00, 0.00, 140.00),
(58, '1x Ventoinha para CPU', 'Troca do cooler do processador.', 150.00, 140.00, 0.00, 290.00),
(59, '1x Touchscreen para iPhone X', 'Troca do digitalizador da tela.', 450.00, 200.00, 0.00, 650.00),
(60, NULL, 'Análise e reparo no cabo flat da dobradiça.', 0.00, 400.00, 50.00, 350.00),
(61, '1x Trackpad Force Touch', 'Substituição do trackpad.', 300.00, 200.00, 0.00, 500.00),
(62, NULL, 'Configuração e provisionamento de eSIM junto à operadora.', 0.00, 150.00, 0.00, 150.00),
(63, NULL, 'Recuperação de software via fastboot.', 0.00, 90.00, 0.00, 90.00),
(64, '1x Sensor biométrico sob a tela', 'Troca e calibração do leitor de digital.', 180.00, 120.00, 0.00, 300.00),
(65, NULL, 'Diagnóstico avançado de placa de vídeo dedicada (GPU).', 0.00, 350.00, 0.00, 350.00),
(66, '1x Chave seletora Silêncio/Som', 'Troca do botão seletor.', 100.00, 100.00, 0.00, 200.00),
(67, '1x Slot de cartão MicroSD', 'Troca do slot de memória.', 40.00, 60.00, 0.00, 100.00),
(68, '1x Display Touch Bar', 'Substituição da tela da Touch Bar.', 500.00, 250.00, 0.00, 750.00),
(69, NULL, 'Limpeza e reparo do conector USB-C.', 0.00, 120.00, 0.00, 120.00);

--
-- Acionadores `servico`
--
DELIMITER $$
CREATE TRIGGER `atualizar_total_servico` BEFORE UPDATE ON `servico` FOR EACH ROW SET NEW.total = (NEW.valorPecas + NEW.valorServico - IFNULL(NEW.desconto, 0.00))
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `calcular_total_servico` BEFORE INSERT ON `servico` FOR EACH ROW SET NEW.total = (NEW.valorPecas + NEW.valorServico - IFNULL(NEW.desconto, 0.00))
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `validar_valores_servico` BEFORE INSERT ON `servico` FOR EACH ROW BEGIN
    IF NEW.valorPecas < 0.00 OR NEW.valorServico < 0.00 OR IFNULL(NEW.desconto, 0.00) < 0.00 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Valores monetários não podem ser negativos.';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `validar_valores_servico_update` BEFORE UPDATE ON `servico` FOR EACH ROW BEGIN
    IF NEW.valorPecas < 0.00 OR NEW.valorServico < 0.00 OR IFNULL(NEW.desconto, 0.00) < 0.00 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Valores monetários não podem ser negativos.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vwclientes`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vwclientes` (
`CodigoCliente` int(11)
,`nome` varchar(50)
,`telefone` varchar(15)
,`cep` varchar(9)
,`endereco` varchar(100)
,`bairro` varchar(50)
,`cidade` varchar(30)
,`uf` varchar(2)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vwos`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vwos` (
`CodigoOS` int(11)
,`NomeCliente` varchar(50)
,`Aparelho` varchar(20)
,`DataDeEntrada` date
,`DataDeSaida` date
,`Status` varchar(50)
,`DescricaoServico` varchar(200)
,`DescricaoPecas` varchar(100)
,`valorPecas` decimal(10,2)
,`valorServico` decimal(10,2)
,`desconto` decimal(10,2)
,`total` decimal(12,2)
,`marca` varchar(20)
,`modelo` varchar(20)
,`serie` varchar(20)
,`defeito` varchar(100)
,`observacao` varchar(200)
,`codigo` bigint(20)
,`CodigoCliente` int(11)
,`CodigoFuncionario` int(11)
);

-- --------------------------------------------------------

--
-- Estrutura para view `vwclientes`
--
DROP TABLE IF EXISTS `vwclientes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vwclientes`  AS SELECT `c`.`cod_C` AS `CodigoCliente`, `p`.`nome` AS `nome`, `c`.`telefone` AS `telefone`, `c`.`cep` AS `cep`, `c`.`endereco` AS `endereco`, `c`.`bairro` AS `bairro`, `ci`.`nome` AS `cidade`, `ci`.`UF` AS `uf` FROM ((`cliente` `c` join `pessoa` `p` on(`c`.`cod_C` = `p`.`cod_P`)) join `cidade` `ci` on(`c`.`cod_Ci` = `ci`.`cod_Ci`)) ;

-- --------------------------------------------------------

--
-- Estrutura para view `vwos`
--
DROP TABLE IF EXISTS `vwos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vwos`  AS SELECT `os`.`cod_Os` AS `CodigoOS`, `p`.`nome` AS `NomeCliente`, `ap`.`nome` AS `Aparelho`, `os`.`dataEntrada` AS `DataDeEntrada`, `os`.`dataSaida` AS `DataDeSaida`, `os`.`status` AS `Status`, `s`.`descServico` AS `DescricaoServico`, `s`.`descPecas` AS `DescricaoPecas`, `s`.`valorPecas` AS `valorPecas`, `s`.`valorServico` AS `valorServico`, `s`.`desconto` AS `desconto`, `s`.`valorPecas`+ `s`.`valorServico` - ifnull(`s`.`desconto`,0) AS `total`, `ap`.`marca` AS `marca`, `ap`.`modelo` AS `modelo`, `ap`.`serie` AS `serie`, `ap`.`defeito` AS `defeito`, `os`.`observacao` AS `observacao`, `os`.`codigo` AS `codigo`, `os`.`cod_C` AS `CodigoCliente`, `os`.`cod_F` AS `CodigoFuncionario` FROM (((`ordemdeservico` `os` left join `pessoa` `p` on(`os`.`cod_C` = `p`.`cod_P`)) left join `aparelho` `ap` on(`os`.`codigo` = `ap`.`codigo`)) left join `servico` `s` on(`os`.`cod_S` = `s`.`cod_S`)) ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aparelho`
--
ALTER TABLE `aparelho`
  ADD PRIMARY KEY (`codigo`);

--
-- Índices de tabela `cidade`
--
ALTER TABLE `cidade`
  ADD PRIMARY KEY (`cod_Ci`);

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`cod_C`),
  ADD KEY `fk_cliente_pk_cidade` (`cod_Ci`);

--
-- Índices de tabela `funcionario`
--
ALTER TABLE `funcionario`
  ADD PRIMARY KEY (`cod_F`);

--
-- Índices de tabela `ordemdeservico`
--
ALTER TABLE `ordemdeservico`
  ADD PRIMARY KEY (`cod_Os`),
  ADD KEY `fk_ordemdeservico_cliente` (`cod_C`),
  ADD KEY `fk_ordemdeservico_funcionario` (`cod_F`),
  ADD KEY `fk_ordemdeservico_cidade` (`cod_Ci`),
  ADD KEY `fk_ordemdeservico_servico` (`cod_S`),
  ADD KEY `fk_ordemdeservico_aparelho` (`codigo`);

--
-- Índices de tabela `pessoa`
--
ALTER TABLE `pessoa`
  ADD PRIMARY KEY (`cod_P`);

--
-- Índices de tabela `servico`
--
ALTER TABLE `servico`
  ADD PRIMARY KEY (`cod_S`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `aparelho`
--
ALTER TABLE `aparelho`
  MODIFY `codigo` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1757800000070;

--
-- AUTO_INCREMENT de tabela `cidade`
--
ALTER TABLE `cidade`
  MODIFY `cod_Ci` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de tabela `ordemdeservico`
--
ALTER TABLE `ordemdeservico`
  MODIFY `cod_Os` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de tabela `pessoa`
--
ALTER TABLE `pessoa`
  MODIFY `cod_P` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de tabela `servico`
--
ALTER TABLE `servico`
  MODIFY `cod_S` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `fk_cliente_pk_cidade` FOREIGN KEY (`cod_Ci`) REFERENCES `cidade` (`cod_Ci`),
  ADD CONSTRAINT `fk_cliente_pk_pessoa` FOREIGN KEY (`cod_C`) REFERENCES `pessoa` (`cod_P`);

--
-- Restrições para tabelas `funcionario`
--
ALTER TABLE `funcionario`
  ADD CONSTRAINT `fk_funcionario_pk_pessoa` FOREIGN KEY (`cod_F`) REFERENCES `pessoa` (`cod_P`);

--
-- Restrições para tabelas `ordemdeservico`
--
ALTER TABLE `ordemdeservico`
  ADD CONSTRAINT `fk_ordemdeservico_aparelho` FOREIGN KEY (`codigo`) REFERENCES `aparelho` (`codigo`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ordemdeservico_cidade` FOREIGN KEY (`cod_Ci`) REFERENCES `cidade` (`cod_Ci`),
  ADD CONSTRAINT `fk_ordemdeservico_cliente` FOREIGN KEY (`cod_C`) REFERENCES `cliente` (`cod_C`),
  ADD CONSTRAINT `fk_ordemdeservico_funcionario` FOREIGN KEY (`cod_F`) REFERENCES `funcionario` (`cod_F`),
  ADD CONSTRAINT `fk_ordemdeservico_servico` FOREIGN KEY (`cod_S`) REFERENCES `servico` (`cod_S`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
