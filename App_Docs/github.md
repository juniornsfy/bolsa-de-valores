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
git remote set-url origin https://<SEU_TOKEN>@github.com/juniornsfp/bolsa-de-valores.git
```