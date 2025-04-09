# Grid Layout

以下是為你的專案撰寫的 `README.md` 檔案描述，涵蓋專案概述、功能、安裝步驟、使用說明和貢獻指南。這個描述基於你提供的檔案，並假設你的應用名稱是 `grid_app`，專案名稱是 `grid_project`。你可以根據實際情況調整內容。

---

![Python](https://img.shields.io/badge/Python-3.10-blue) ![Django](https://img.shields.io/badge/Django-4.2-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

**Grid Project** 是一個基於 Django 的網頁應用程式，允許使用者創建、保存和管理可拖曳的方格佈局。該專案支援使用者身份驗證，每個使用者擁有獨立的佈局版本，並提供歷史佈局查看與刪除功能。

## 功能
- **方格編輯器**：使用者可以新增、拖曳、調整大小和刪除方格，並檢查方格重疊。
- **佈局保存與加載**：將當前佈局保存到資料庫，並加載特定版本的佈局。
- **使用者管理**：支援登入與登出，每個使用者擁有獨立的佈局版本。
- **歷史佈局**：查看所有歷史佈局版本，並顯示相關的方格資料，可選擇加載或刪除。
- **資料庫**：使用 SQLite 儲存佈局和方格資料。

## 技術棧
- **後端**：Django 4.2
- **前端**：HTML, CSS, JavaScript (jQuery, jQuery UI)
- **資料庫**：SQLite3
- **身份驗證**：Django Authentication

## 安裝與設置

### 先決條件
- Python 3.10+
- Git

### 安裝步驟
1. **複製專案**
   ```bash
   git clone https://github.com/your-username/grid_project_test2.git
   cd grid_project_test2
   ```

2. **創建虛擬環境**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **安裝依賴**
   ```bash
   pip install -r requirements.txt
   ```
   > 注意：如果沒有 `requirements.txt`，請手動安裝：
   > ```bash
   > pip install django
   > ```

4. **初始化資料庫**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **創建超級使用者**
   ```bash
   python manage.py createsuperuser
   ```

6. **啟動伺服器**
   ```bash
   python manage.py runserver
   ```
   然後在瀏覽器中訪問 `http://127.0.0.1:8000/`。

## 使用說明
1. **登入**：
   - 訪問 `/login/`，輸入你的使用者名稱和密碼（使用超級使用者或註冊新帳號）。
   
2. **編輯方格**：
   - 在主頁面（`/`）使用「新增方格」按鈕添加方格。
   - 拖曳方格移動位置，調整大小，或雙擊刪除。
   - 點擊「保存佈局」儲存當前佈局。

3. **查看歷史佈局**：
   - 點擊「載入歷史佈局」跳轉到 `/layout-versions/`。
   - 查看你的所有佈局版本，點擊「Load」加載特定版本，或「Delete」刪除。

4. **登出**：
   - 在頁面右上角點擊「登出」返回登入頁面。

## 專案結構
```
grid_project_test2/
├── grid_app/                # 應用目錄
│   ├── migrations/          # 資料庫遷移檔案
│   ├── static/              # 靜態檔案
│   │   └── js/
│   │       └── grid_editor.js  # 前端邏輯
│   ├── templates/           # HTML 模板
│   │   ├── grid_editor.html   # 主編輯頁面
│   │   ├── layout_versions.html  # 歷史佈局頁面
│   │   ├── grid_list.html     # 方格列表頁面
│   │   └── login.html         # 登入頁面
│   ├── __init__.py
│   ├── models.py            # 資料模型
│   ├── urls.py              # URL 路由
│   └── views.py             # 視圖邏輯
├── manage.py                # Django 管理腳本
├── db.sqlite3               # SQLite 資料庫
└── requirements.txt         # 依賴清單（需手動創建）
```

## 資料模型
- **LayoutVersion**：儲存佈局版本，包含使用者、名稱和時間戳。
- **Grid**：儲存單個方格，包含位置 (x, y)、大小 (width, height) 和關聯的佈局版本。

## 貢獻
歡迎對此專案提出建議或貢獻程式碼！請按照以下步驟：
1. Fork 此儲存庫。
2. 創建一個新分支（`git checkout -b feature/your-feature`）。
3. 提交你的更改（`git commit -m "Add your feature"`）。
4. 推送分支（`git push origin feature/your-feature`）。
5. 提交 Pull Request。

## 授權
本專案採用 [MIT 許可證](LICENSE)。

---

### 如何添加到專案
1. 在專案根目錄下創建一個新檔案 `README.md`。
2. 將上述內容複製並貼上到 `README.md` 中。
3. 根據你的實際情況修改：
   - 將 `your-username` 替換為你的 GitHub 使用者名稱。
   - 如果有 `requirements.txt`，確認其存在；若無，需手動創建（例如 `echo "django>=4.2" > requirements.txt`）。
   - 添加專案特定的截圖或徽章（可選）。

### 上傳到 GitHub
假設你已經按照之前的步驟初始化並推送專案，現在只需添加 `README.md` 並推送：
```bash
git add README.md
git commit -m "Add README file"
git push origin main
```

完成後，你的 GitHub 儲存庫頁面將顯示這個 `README.md` 作為首頁描述。如果有其他需求（例如添加專案截圖或詳細說明某功能），請告訴我！
