module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "airbnb",
        "airbnb/hooks",
        "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "overrides": [
        {
            "files": ["*.ts", "*.tsx"],
            "plugins": ["@typescript-eslint"],
            "rules": {
                "no-unused-vars": "off",
                "@typescript-eslint/no-unused-vars": [
                    "error",
                    {
                        "argsIgnorePattern": "^_",
                        "varsIgnorePattern": "^_"
                    }
                ],
                "react/prop-types": "off",
                "react/require-default-props": "off",
                "react/jsx-filename-extension": [
                    "error",
                    {
                        "extensions": [".jsx", ".tsx"]
                    }
                ]
            }
        },
        {
            "files": ["src/content.config.ts"],
            "rules": {
                "import/prefer-default-export": "off"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "settings": {
        "react": {
            "version": "detect"
        },
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        "import/resolver": {
            "node": {
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        },
        "import/core-modules": ["astro:content", "astro/loaders"]
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/forbid-prop-types": "off",
        "react/jsx-props-no-spreading": "off",
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                "js": "never",
                "jsx": "never",
                "ts": "never",
                "tsx": "never"
            }
        ]
    }
}
