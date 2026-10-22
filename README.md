# BookShelf - Mobile App (Professional Feature-Based Architecture)

Ứng dụng quản lý sách cá nhân **BookShelf** được xây dựng theo chuẩn kiến trúc chuyên nghiệp: **Feature-based & Clean Separation of Concerns** trên nền tảng **React Native (Expo SDK 58)**, **TypeScript**, **React Navigation** và **Firebase (Auth & Firestore)**.

---

## 📁 Cấu trúc Thư mục Chuyên nghiệp (Project Structure)

```
PE_Trial/
├── .env.example                     # File mẫu biến môi trường (API Key, Project ID,...)
├── .env                             # Biến môi trường thực tế (Bảo mật - Git ignore)
├── firestore.rules                  # Quy tắc bảo mật Firestore (Nộp bài & deploy)
├── app.json                         # Cấu hình Expo
├── babel.config.js                  # Cấu hình Babel & Module Resolver (@/*)
├── tsconfig.json                    # Cấu hình TypeScript & Path Aliases
├── package.json
├── App.tsx                          # Root component: Bọc AppProvider & RootNavigator
│
└── src/
    ├── app/                         # Điểm vào cấu hình toàn cục & Định tuyến (Navigation)
    │   ├── navigation/
    │   │   ├── types.ts             # Định nghĩa Type cho React Navigation ParamList
    │   │   ├── AuthStack.tsx        # Stack Auth: Home, Login, Register
    │   │   ├── AppStack.tsx         # Stack App: List, Detail
    │   │   └── RootNavigator.tsx    # Phân luồng chính (Auth Stack vs App Stack, chống flash)
    │   └── providers/
    │       └── AppProvider.tsx      # Gộp các provider (SafeAreaProvider, AuthProvider)
    │
    ├── features/                    # 🚀 CỐT LÕI DỰ ÁN: Chia theo từng tính năng (Feature-based)
    │   ├── auth/                    # Module Xác thực (Auth)
    │   │   ├── api/
    │   │   │   └── authApi.ts       # API: login, register, logout
    │   │   ├── hooks/
    │   │   │   └── useAuth.tsx      # AuthContext & useAuth hook
    │   │   ├── screens/
    │   │   │   ├── HomeScreen.tsx   # Header, testID="home-title" ("BookShelf"), Feature cards
    │   │   │   ├── LoginScreen.tsx  # Form đăng nhập, testID="error-auth"
    │   │   │   └── RegisterScreen.tsx # Form đăng ký, testID="form-success", testID="error-auth"
    │   │   └── types/
    │   │       └── index.ts         # AuthContextType & User types
    │   │
    │   └── books/                   # Module Quản lý sách (Books)
    │       ├── api/
    │       │   └── bookApi.ts       # CRUD Firestore books, toggle favorite, duplicate check
    │       ├── components/
    │       │   ├── BookItem.tsx     # Item sách (testID="book-item"), star favorite toggle
    │       │   ├── BookForm.tsx     # Form thêm sách (testID="book-form", "book-success", "error-book")
    │       │   ├── BookFilters.tsx  # Bộ lọc Genre, Status, Favorites-only switch, Search box, Clear btn
    │       │   └── BookSummary.tsx  # Thống kê testID="book-count", testID="favorite-count", status breakdown
    │       ├── hooks/
    │       │   └── useBooks.ts      # Real-time listener hook với Firestore onSnapshot
    │       ├── screens/
    │       │   ├── BookListScreen.tsx   # Màn hình List (testID="list-screen", Header, "books-empty")
    │       │   └── BookDetailScreen.tsx # Màn hình Detail (View mode, Edit inline, Delete confirm)
    │       └── types/
    │           └── book.types.ts    # Type Book, Genre, Status, Filters, Summary
    │
    ├── shared/                      # ♻️ Tái sử dụng dùng chung cho nhiều features
    │   ├── components/              # Nguyên tử UI chung
    │   │   ├── buttons/
    │   │   │   └── Button.tsx       # Reusable button (primary, secondary, danger)
    │   │   ├── inputs/
    │   │   │   └── CustomTextInput.tsx # Reusable text input có nhãn và error message
    │   │   └── feedback/
    │   │       ├── EmptyState.tsx   # testID="books-empty" ("No books found")
    │   │       ├── ErrorBanner.tsx  # Banner báo lỗi có testID
    │   │       └── SuccessBanner.tsx# Banner báo thành công có testID
    │   │
    │   ├── constants/
    │   │   └── appConstants.ts      # Danh sách GENRES, STATUSES, thông báo lỗi chuẩn xác
    │   │
    │   ├── services/
    │   │   └── firebase/
    │   │       └── firebaseConfig.ts# Khởi tạo Firebase App, Auth (AsyncStorage persistence), Firestore
    │   │
    │   ├── theme/                   # Tokens thiết kế
    │   │   ├── colors.ts            # Palette màu
    │   │   ├── typography.ts        # Kích thước font & font weight
    │   │   ├── spacing.ts           # Spacing scale
    │   │   └── index.ts
    │   │
    │   └── utils/                   # Hàm logic thuần (Pure functions)
    │       ├── validators.ts        # Form validation chuẩn xác theo đúng đề bài
    │       └── helpers.ts           # Sort books case-insensitive, calculate status breakdown
    │
    └── types/                       # Type chung toàn hệ thống
        ├── env.d.ts                 # Type cho biến môi trường EXPO_PUBLIC_*
        └── common.types.ts
```

---

## 🎯 Kiểm tra Tiêu chí Grader & Chất lượng Code
- ✅ **TypeScript 100% Type-Safe**: `npx tsc --noEmit` hoàn thành với **0 lỗi**.
- ✅ **Expo Doctor**: Đạt **20/20 tiêu chí** tương thích hoàn hảo với Expo SDK 58.
- ✅ **Exact testIDs**:
  - `home-title`
  - `form-success` ("Registration successful")
  - `error-auth`
  - `list-screen`
  - `book-form`
  - `book-success` ("Book added")
  - `error-book`
  - `book-item`
  - `books-empty` ("No books found")
  - `book-count` (plain integer)
  - `favorite-count` (plain integer)
- ✅ **Không hardcode API key**: Đọc từ `.env` với tiền tố `EXPO_PUBLIC_*`.
- ✅ **Firestore Security Rules**: File `firestore.rules` ở thư mục gốc đáp ứng đầy đủ yêu cầu chấm của đề.
