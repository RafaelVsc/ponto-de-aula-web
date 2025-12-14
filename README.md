# Ponto de Aula - Frontend

Este é o repositório do frontend para a aplicação Ponto de Aula, uma plataforma para gerenciamento de posts e conteúdos educacionais. A aplicação é um SPA (Single Page Application) construído com React e Vite.

## Funcionalidades

-   **Autenticação de Usuários:** Sistema de Login e Logout com tokens JWT.
-   **Controle de Acesso por Função:** Diferentes permissões para administradores, professores e alunos.
-   **Dashboard Principal:** Visualização centralizada dos posts.
-   **Gerenciamento de Posts (CRUD):**
    -   Criação de posts com um editor de texto rico.
    -   Visualização detalhada dos posts.
    -   Edição e exclusão de posts.
    -   Listagem de posts criados pelo próprio usuário.
-   **Gerenciamento de Usuários:** Painel para administradores gerenciarem contas de usuários.
-   **Edição de Perfil:** Permite que os usuários atualizem suas próprias informações.
-   **Filtros e visualização:** Busca por título/conteúdo, tags e autores; alternância entre grid e tabela.

## Tecnologias Utilizadas (Tech Stack)

-   **Framework:** [React](https://react.dev/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
-   **Roteamento:** [React Router](https://reactrouter.com/)
-   **Cliente HTTP:** [Axios](https://axios-http.com/)
-   **Gerenciamento de Formulários:** [React Hook Form](https://react-hook-form.com/)
-   **Validação de Esquemas:** [Zod](https://zod.dev/)
-   **Editor de Texto:** [ReactQuill New](https://www.npmjs.com/package/react-quill-new)
-   **Segurança (HTML Sanitizer):** [DOMPurify](https://github.com/cure53/DOMPurify)

## Guia de Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en) (versão 18 ou superior)
-   [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)

### 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd ponto-de-aula-frontend
```

### 2. Instalar as Dependências

Execute o comando abaixo para instalar todas as dependências listadas no `package.json`.

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Este projeto precisa se conectar a um backend. Você precisa especificar a URL da API em um arquivo de ambiente.

-   Crie um arquivo chamado `.env` na raiz do projeto.
-   Adicione a seguinte linha a ele, substituindo pela URL do seu backend:

```env
VITE_API_URL=http://localhost:3000
```

Se nenhuma URL for fornecida, o projeto usará `http://localhost:3000` como padrão.

### 4. Executar o Projeto

Após a instalação e configuração, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

## Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento com Hot-Reload.
-   `npm run build`: Compila e otimiza a aplicação para produção.
-   `npm run lint`: Executa o linter (ESLint) para encontrar problemas no código.
-   `npm run format`: Formata todo o código utilizando o Prettier.
-   `npm run preview`: Inicia um servidor local para visualizar a versão de produção (build).

## Rotas Principais
- `/dashboard`: feed geral com filtros.
- `/posts/mine`: posts do usuário logado (grid/tabela).
- `/posts/new` e `/posts/edit/:id`: criação/edição de posts.
- `/posts/:id`: detalhe do post.
- `/users`, `/users/new`, `/users/edit/:id`: gestão de usuários (apenas perfis autorizados).
- `/profile`: dados pessoais e troca de senha.

## Permissões (resumo)
- **Admin:** gerencia usuários (todas as roles) e posts; cria/edita/deleta posts.
- **Secretary:** gerencia usuários somente Teacher/Student; cria/edita/deleta posts.
- **Teacher:** cria/edita/deleta os próprios posts; não gerencia usuários.
- **Student:** somente leitura dos posts; não vê botões de criação/edição/deleção.

## Editor de Texto
- Usamos **ReactQuill New**; o conteúdo é salvo como HTML e renderizado com **DOMPurify** para evitar XSS.
- No card de listagem é mostrado apenas o preview em texto simples; na página de detalhe o HTML sanitizado é exibido com estilos para títulos, listas e citações.

## Notas rápidas
- Backend precisa estar rodando e expor `/users/me` e demais endpoints com JWT (Authorization: Bearer).
- Use `npm run lint` antes de PRs para manter o padrão de código.
