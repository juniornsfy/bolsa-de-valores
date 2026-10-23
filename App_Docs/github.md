#### conexão via navegador
```
git config user.name "juniornsfy"
git config user.email "junior.nsf@yahoo.com"
```

``` 
git remote set-url origin https://github.com/juniornsfy/bolsa-de-valores.git
git config --global credential.helper vscode
```

```
git config --global --replace-all credential.helper ""
git config --global --add credential.helper manager
git config --show-origin --get-all credential.helper
```

```
git credential-manager github login
```

#### conexão via tokens
<https://github.com/settings/personal-access-tokens>
<https://github.com/settings/tokens>
```
git remote set-url origin https://<SEU_TOKEN>@github.com/juniornsfy/bolsa-de-valores.git
```


#### Logar em uma conta no GitHub
```
gh auth login
```

Alternar entre as contas
Para ativar a conta juniornsfy, execute:

```
gh auth switch --user juniornsfy
```

Para voltar à conta juniornsfy:
```
gh auth switch --user juniornsfy
```

Confira qual conta está ativa:
```
gh auth status
```
 
2. Remover uma conta do GitHub CLI
Se você quiser desconectar a conta juniorjrfsn, execute:
```
gh auth logout --hostname github.com --user juniorjfsny
gh auth logout --hostname github.com --user juniorjrfsn
```
 
Confirme a operação se o CLI solicitar.

Atenção: isso remove a autenticação dessa conta no GitHub CLI, mas não necessariamente a desconecta do VS Code ou remove todas as credenciais armazenadas no Windows.
3. Verificar qual conta o Git usa nos seus projetos
Dentro da pasta do projeto, execute:
```
git config user.name
git config user.email
git remote -v
```
