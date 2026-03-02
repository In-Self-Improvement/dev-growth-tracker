# sokind-global-web 프로젝트 아키텍처 문서

> dev-growth-tracker에 적용할 Next.js 프로젝트 구조 및 규칙 정리

---

## 1) 최상위 폴더 구조 (src 기준)

### App Router 사용 여부
✅ **Next.js App Router (v16.1.6)** 사용

### 디렉토리 트리

```
src/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # i18n 라우팅 (ko, en, hi, ne, bn)
│   │   ├── layout.tsx           # 루트 레이아웃 (폰트, 프로바이더)
│   │   ├── (auth)/              # 인증 전 라우트 그룹
│   │   │   ├── auth/
│   │   │   └── ...
│   │   └── (main)/              # 인증 후 라우트 그룹
│   │       ├── layout.tsx       # 메인 레이아웃
│   │       ├── (bottom-tabs)/   # 하단 네비 있는 페이지
│   │       │   ├── layout.tsx   # 병렬 슬롯 (@bottom)
│   │       │   ├── home/
│   │       │   ├── training/
│   │       │   ├── report/
│   │       │   └── more/
│   │       └── (details)/       # 하단 네비 없는 상세 페이지
│   │           ├── likes/
│   │           ├── notifications/
│   │           └── ...
│   └── api/                      # Route Handlers
│       ├── health/
│       ├── auth/refresh/
│       └── well-known/
│
├── screens/                      # 페이지별 비즈니스 로직
│   ├── auth/                    # 인증 화면
│   │   ├── join/
│   │   ├── login/
│   │   ├── sign-up/
│   │   └── verify/
│   ├── legal/                   # 법적 문서 화면
│   │   ├── marketing-terms/
│   │   ├── privacy/
│   │   └── terms/
│   └── main/
│       ├── home/
│       │   ├── index.tsx        # 페이지 컴포넌트
│       │   └── _components/     # 페이지 전용 컴포넌트
│       ├── likes/
│       │   ├── _components/
│       │   └── _hooks/
│       ├── more/
│       ├── notifications/
│       ├── report/
│       │   ├── _components/
│       │   ├── _constants/
│       │   ├── _types/
│       │   ├── _utils/
│       │   ├── detail/
│       │   ├── history/
│       │   └── weekly/
│       └── training/
│           ├── _components/
│           ├── _hooks/
│           ├── _utils/
│           └── ai-role-play/
│               ├── courses/
│               │   └── _components/
│               ├── detail/
│               │   └── _components/
│               ├── speech/
│               │   ├── _components/
│               │   ├── _constants/
│               │   ├── _hooks/
│               │   └── _utils/
│               ├── complete/
│               ├── _components/
│               ├── _stores/     # 페이지 전용 스토어
│               ├── _constants/
│               └── _hooks/
│
├── components/                   # 전역 재사용 컴포넌트 (48개+)
│   ├── button/
│   │   ├── index.tsx
│   │   └── buttonVariants.ts   # CVA 스타일 정의
│   ├── avatar/
│   ├── header/
│   ├── spinner/
│   ├── dialog/
│   ├── bottom-sheet/
│   └── ...
│
├── hooks/                        # 전역 커스텀 훅
│   ├── use-invalidate-query.ts
│   ├── use-overlay.tsx
│   ├── use-login.ts
│   ├── use-funnel/
│   └── ...
│
├── stores/                       # 전역 Zustand 스토어
│   ├── use-bridge-store.ts
│   ├── use-overlay-store.ts
│   ├── use-scroll-position-store.ts
│   └── use-user-media-permission-store.ts
│
├── lib/                          # 써드파티 라이브러리 설정
│   ├── axios/
│   │   ├── index.ts            # Axios 인스턴스 + 인터셉터
│   │   └── sentry-capture-api-error.ts
│   ├── tanstack-query/
│   │   └── get-query-client.ts
│   ├── dayjs/
│   ├── api-yaml/
│   ├── scripts/
│   └── utils/
│
├── orval/                        # 🤖 Orval 자동 생성 (OpenAPI)
│   ├── api/                     # React Query 훅 (태그별 분리)
│   │   ├── ai-role-play/
│   │   ├── home/
│   │   ├── auth/
│   │   ├── device/
│   │   ├── keyword-mastery/
│   │   ├── quiz/
│   │   ├── rehearsal/
│   │   ├── script-mastery/
│   │   ├── shadowing/
│   │   ├── report/
│   │   ├── notification/
│   │   ├── my-page/
│   │   ├── live-kit/
│   │   ├── liked-course/
│   │   ├── user/
│   │   ├── storage/
│   │   └── ...                 # 19개 API 모듈
│   └── model/                   # TypeScript 타입 정의 (256개+)
│
├── actions/                      # Next.js Server Actions
│   └── auth/
│       └── index.ts             # 토큰 관리
│
├── constants/                    # 전역 상수
│   ├── query-cache-time.ts
│   ├── cookie-names.ts
│   ├── env-urls.ts
│   └── ...
│
├── types/                        # 전역 타입 정의
│   ├── common.ts
│   └── intl-types.ts           # next-intl 자동 생성
│
├── utils/                        # 유틸리티 함수
│   └── cn.ts                    # clsx + tailwind-merge
│
├── providers/                    # React Context 프로바이더
│   ├── bridge-provider/
│   ├── dayjs-provider/
│   ├── identity-provider/
│   ├── overlay-provider/
│   └── theme-provider/
│
├── services/                     # 서비스 레이어
│   └── ...
│
├── integrations/                 # 외부 통합
│   └── external-script/
│
├── i18n/                         # 국제화 설정
│   └── ...
│
├── styles/                       # 글로벌 스타일
│   └── ...
│
├── storybook/                    # Storybook 설정
│   └── ...
│
└── assets/                       # 정적 자산
    ├── images/
    ├── fonts/
    ├── icons/
    └── lotties/
```

---

## 2) 레이어/도메인 기준

### 조직화 원칙: **3계층 구조 (Screens → Components → Shared)**

#### Layer 1: Screens (기능 중심)
- **위치**: `/src/screens/{domain}/{page}/`
- **책임**: 페이지별 비즈니스 로직, 컨테이너 컴포넌트
- **규칙**:
  - `index.tsx`: 페이지 메인 컴포넌트
  - `_components/`: 해당 페이지에서만 사용하는 컴포넌트
  - `_hooks/`: 해당 페이지 전용 커스텀 훅 (예: optimistic update 로직)
  - `_types/`: 페이지 전용 타입
  - `_constants/`: 페이지 전용 상수
  - `_stores/`: 페이지 전용 Zustand 스토어 (ephemeral state)
  - `_utils/`: 페이지 전용 유틸리티 함수

#### Layer 2: Components (재사용 UI)
- **위치**: `/src/components/`
- **책임**: 2개 이상 페이지에서 사용하는 UI 컴포넌트
- **규칙**:
  - shadcn/ui 기반 컴포넌트 (Radix UI primitives)
  - 각 컴포넌트는 별도 폴더에 `index.tsx` + `{name}Variants.ts` (CVA)
  - 비즈니스 로직 포함 금지 (프레젠테이션 컴포넌트)

#### Layer 3: Shared (전역 유틸리티)
- **위치**: `/src/hooks/`, `/src/stores/`, `/src/lib/`, `/src/utils/`, `/src/constants/`, `/src/types/`
- **책임**: 프로젝트 전역에서 사용되는 공통 로직
- **규칙**:
  - `hooks/`: 전역 커스텀 훅
  - `stores/`: 전역 상태 관리 (Zustand)
  - `lib/`: 써드파티 라이브러리 설정
  - `utils/`: 순수 함수
  - `constants/`: 전역 상수
  - `types/`: 전역 타입

### 금지 규칙
- ❌ **절대 금지**: `_components/` 폴더의 컴포넌트를 다른 페이지에서 import
- ❌ **절대 금지**: `/src/components/`에 페이지 전용 컴포넌트 배치
- ❌ **절대 금지**: 한 파일에 2개 이상의 컴포넌트 정의 (분리 필수)
- ❌ **절대 금지**: `/src/orval/` 파일 수동 수정 (자동 생성 전용)

---

## 3) 파일 네이밍 규칙

### 컴포넌트
- **파일명**: `kebab-case` (예: `customer-service.tsx`, `ai-role-play-courses.tsx`)
- **컴포넌트명**: `PascalCase` (예: `CustomerService`, `AIRolePlayCourses`)
- **Export 방식**: Named export 사용 (`export { Button }`)

### 훅
- **파일명**: `use-{name}.ts` (예: `use-zendesk.ts`, `use-overlay.tsx`)
- **함수명**: `use{Name}` (예: `useZendesk`, `useOverlay`)

### 유틸
- **파일명**: `kebab-case.ts` (예: `cn.ts`, `format-date.ts`)
- **함수명**: `camelCase` (예: `cn`, `formatDate`)

### 타입
- **파일명**: `kebab-case.ts` (예: `common.ts`, `button-props.ts`)
- **타입명**: `PascalCase + Type 접미사` (예: `ButtonPropsType`, `UserInfoType`)

### API 파일
- **자동 생성**: `/src/orval/api/{tag}/{tag}.ts` (예: `ai-role-play.ts`)
- **네이밍 패턴**:
  - Fetcher: `get{OperationName}` (예: `getAiRolePlayCourseList`)
  - Query Key: `getGet{OperationName}QueryKey`
  - Query Options: `getGet{OperationName}QueryOptions`
  - Infinite Query Key: `getGet{OperationName}InfiniteQueryKey`

### 상수
- **파일명**: `kebab-case.ts` (예: `query-cache-time.ts`)
- **상수명**: `UPPER_SNAKE_CASE` (예: `SOKIND_ACCESS_TOKEN_COOKIE`, `STALE_TIME`)

### Barrel Export (index.ts)
- **사용 여부**: ✅ **적극 사용**
- **패턴**: 모든 주요 디렉토리에 `index.ts/tsx` 배치
- **목적**: Clean import path 제공
  ```typescript
  // ✅ Good
  import { Button } from '@/components/button';

  // ❌ Bad
  import { Button } from '@/components/button/button';
  ```

---

## 4) 라우팅 규칙

### App Router Route Groups 사용

#### Route Group 구조
```
app/[locale]/
├── (auth)/              # 인증 전 라우트 (로그인, 회원가입)
│   └── auth/
│
├── (main)/              # 인증 후 라우트
│   ├── layout.tsx       # 메인 레이아웃 (프로바이더, 설정)
│   ├── (bottom-tabs)/   # 하단 네비게이션 있는 페이지
│   │   ├── layout.tsx   # 병렬 슬롯 (@bottom) 사용
│   │   ├── @bottom/     # 병렬 슬롯 - 하단 네비
│   │   ├── home/
│   │   ├── training/
│   │   ├── report/
│   │   └── more/
│   │
│   └── (details)/       # 하단 네비 없는 상세 페이지
│       ├── likes/
│       ├── notifications/
│       └── training/{type}/{id}/
│
├── marketing-terms/     # 법적 문서 (공개)
├── privacy/
└── terms/
```

### Layout 배치 원칙

1. **Root Layout** (`app/[locale]/layout.tsx`)
   - 역할: 폰트 로딩, 전역 프로바이더, HTML/body 태그
   - 포함: `next-intl`, `ReactQueryProvider`, `BridgeProvider`, Sentry
   ```tsx
   export default function RootLayout({
     children,
     params: { locale },
   }: {
     children: React.ReactNode;
     params: { locale: string };
   }) {
     return (
       <html lang={locale}>
         <body className={cn(pretendard.variable, tossFace.variable)}>
           <NextIntlProvider>
             <ReactQueryProvider>
               <BridgeProvider>
                 {children}
               </BridgeProvider>
             </ReactQueryProvider>
           </NextIntlProvider>
         </body>
       </html>
     );
   }
   ```

2. **Main Layout** (`app/[locale]/(main)/layout.tsx`)
   - 역할: 인증 체크, 메인 앱 레이아웃
   - 포함: 인증 가드, 공통 UI 컴포넌트

3. **Bottom Tabs Layout** (`app/[locale]/(main)/(bottom-tabs)/layout.tsx`)
   - 역할: 하단 네비게이션 영구 표시
   - 패턴: **병렬 슬롯 (Parallel Routes)** 사용
   ```tsx
   export default function BottomTabsLayout({
     children,
     bottom,
   }: {
     children: React.ReactNode;
     bottom: React.ReactNode;
   }) {
     return (
       <>
         {children}
         {bottom}
       </>
     );
   }
   ```

### Public vs Authed 구분 방식

- **Route Group으로 분리**: `(auth)` vs `(main)`
- **인증 체크 위치**: `(main)/layout.tsx` 또는 middleware
- **Middleware 사용**: `middleware.ts`에서 토큰 검증 및 리다이렉트

### i18n 라우팅
- **라이브러리**: `next-intl`
- **지원 언어**: `ko`, `en`, `hi`, `ne`, `bn` (5개 언어)
- **패턴**: `[locale]` 동적 세그먼트로 모든 라우트 래핑
- **번역 파일**: `/messages/{locale}/`

---

## 5) 상태 관리 규칙

### React Query (서버 상태)

#### Query Keys 위치
- **자동 생성**: `/src/orval/api/{tag}/{tag}.ts`
- **패턴**:
  ```typescript
  // 일반 쿼리
  export const getGetAiRolePlayCourseListQueryKey = (params) => {
    return [`/api/v1/ai-role-play`, ...(params ? [params] : [])] as const;
  };

  // Infinite 쿼리
  export const getGetAiRolePlayCourseListInfiniteQueryKey = (params) => {
    return ['infinite', `/api/v1/ai-role-play`, ...(params ? [params] : [])] as const;
  };
  ```

#### Fetcher Functions 위치
- **자동 생성**: `/src/orval/api/{tag}/{tag}.ts`
- **패턴**:
  ```typescript
  export const getAiRolePlayCourseList = (
    params?: GetAiRolePlayCourseListParams,
    options?: SecondParameter<typeof axiosInstanceForOrval>,
    signal?: AbortSignal,
  ) => {
    return axiosInstanceForOrval<CourseListResponse>(
      { url: `/api/v1/ai-role-play`, method: 'GET', params, signal },
      options,
    );
  };
  ```

#### Custom Hooks 위치
- **전역 유틸리티**: `/src/hooks/use-invalidate-query.ts`
  ```typescript
  export const useInvalidateQuery = () => {
    const queryClient = useQueryClient();

    const invalidateQuery = (queryKey: QueryKey) => {
      queryClient.invalidateQueries({ queryKey });
    };

    const batchInvalidateQuery = (queryKeys: QueryKey[]) => {
      queryKeys.forEach((queryKey) => invalidateQuery(queryKey));
    };

    return { invalidateQuery, batchInvalidateQuery };
  };
  ```

- **페이지 전용 훅**: `/src/screens/{page}/_hooks/use-{feature}-optimistic-{action}.ts`

#### QueryClient 설정
- **위치**: `/src/lib/tanstack-query/get-query-client.ts`
- **기본 설정**:
  ```typescript
  export function getQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30 * 1000, // 30초
        },
      },
    });
  }
  ```

#### Cache Time 상수
- **위치**: `/src/constants/query-cache-time.ts`
  ```typescript
  export const STALE_TIME = 180; // 3분 (초 단위)
  export const MINUTE = 60; // 1분 (초 단위)
  ```

### Zustand (클라이언트 상태)

#### Store 파일 위치
- **전역**: `/src/stores/use-{name}-store.ts`
- **페이지 전용**: `/src/screens/{page}/_stores/use-{name}-store.ts`

#### 네이밍 컨벤션
- **파일명**: `use-{name}-store.ts`
- **Store Hook 명**: `use{Name}Store`
- **예시**: `use-overlay-store.ts` → `useOverlayStore`

#### Store 생성 기준

**✅ Zustand Store를 만드는 경우:**
1. **UI 상태** (모달, 다이얼로그, 토스트)
2. **디바이스/플랫폼 정보** (네이티브 브릿지 데이터)
3. **브라우저 권한 상태** (카메라, 마이크)
4. **세션 임시 데이터** (스크롤 위치, 룸 토큰)
5. **localStorage 연동** (persist middleware 사용)

**❌ Zustand Store를 만들지 않는 경우:**
1. **서버 데이터** → React Query 사용
2. **폼 상태** → React Hook Form 또는 로컬 useState
3. **일시적 UI 상태** (로딩, 에러) → React Query의 상태 활용
4. **URL 기반 상태** (필터, 페이지네이션) → useSearchParams 사용

#### Store 패턴
```typescript
// src/stores/use-overlay-store.ts
import { create } from 'zustand';

interface OverlayStateType {
  props: {
    dialog: DialogPropsType;
    bottomSheet: BottomSheetPropsType;
  };
  updateOverlayProps: (type: OverlayTypes, props: DialogPropsType | BottomSheetPropsType) => void;
  closeOverlay: (type: OverlayTypes) => void;
}

export const useOverlayStore = create<OverlayStateType>((set) => ({
  props: {
    bottomSheet: { isOpen: false },
    dialog: { isOpen: false },
  },

  updateOverlayProps: (type, newDialogProps) =>
    set((state) => ({
      ...state,
      props: { ...state.props, [String(type)]: newDialogProps },
    })),

  closeOverlay: (type: OverlayTypes) =>
    set((state) => ({
      ...state,
      props: { ...state.props, [String(type)]: { isOpen: false } },
    })),
}));
```

#### Persist Middleware 사용
```typescript
// src/stores/use-scroll-position-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useScrollPositionStore = create(
  persist(
    (set) => ({
      positions: {},
      savePosition: (key: string, position: number) =>
        set((state) => ({
          positions: { ...state.positions, [key]: position },
        })),
    }),
    {
      name: 'scroll-position-storage', // localStorage key
    },
  ),
);
```

### 서버 상태 vs 클라이언트 상태 분리

| 상태 유형 | 도구 | 위치 | 예시 |
|-----------|------|------|------|
| API 응답 데이터 | React Query | `/src/orval/` | 코스 리스트, 유저 정보 |
| 캐시/페칭 상태 | React Query | - | isLoading, isFetching, error |
| UI 오버레이 | Zustand | `/src/stores/` | Dialog, BottomSheet |
| 디바이스 정보 | Zustand (persist) | `/src/stores/` | isInApp, platform, UUID |
| 브라우저 권한 | Zustand | `/src/stores/` | camera, microphone |
| 스크롤 위치 | Zustand (persist) | `/src/stores/` | 페이지별 스크롤 복원 |
| 임시 세션 데이터 | Zustand | `/_stores/` | LiveKit 룸 토큰 |
| URL 기반 상태 | useSearchParams | - | 필터, 검색어 |
| 폼 상태 | useState/RHF | - | 입력값, 검증 |

---

## 6) API/서버 코드 위치 규칙

### Route Handlers (app/api)

#### 사용 패턴
- **위치**: `/src/app/api/{endpoint}/route.ts`
- **용도**: 서버 사이드 API 엔드포인트 (BFF 패턴)
- **예시**:
  - Health check: `/api/health/liveness`
  - Token refresh: `/api/auth/refresh`
  - Apple/Android App Links: `/api/well-known/`

#### 구조
```typescript
// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('SOKIND_REFRESH_TOKEN_COOKIE');

  // 토큰 갱신 로직
  const { accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshToken);

  const response = NextResponse.json({ success: true });
  response.cookies.set('SOKIND_ACCESS_TOKEN_COOKIE', accessToken);
  response.cookies.set('SOKIND_REFRESH_TOKEN_COOKIE', newRefreshToken);

  return response;
}
```

### Server Actions

#### 사용 여부
✅ **사용 중**

#### 위치
- `/src/actions/auth/index.ts`

#### 패턴
```typescript
// src/actions/auth/index.ts
'use server';

import { cookies } from 'next/headers';

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get('SOKIND_ACCESS_TOKEN_COOKIE')?.value;
}

export async function setAccessToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('SOKIND_ACCESS_TOKEN_COOKIE', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
}
```

### API Client (Axios)

#### 위치
- **Axios 인스턴스**: `/src/lib/axios/index.ts`
- **Sentry 에러 처리**: `/src/lib/axios/sentry-capture-api-error.ts`

#### Axios 인터셉터 구조
```typescript
// src/lib/axios/index.ts
import axios from 'axios';
import { getAccessToken } from '@/actions/auth';

export const axiosInstanceForOrval = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Request Interceptor: 토큰 주입
axiosInstanceForOrval.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: 401 에러 시 토큰 갱신
axiosInstanceForOrval.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await fetch('/api/auth/refresh', { method: 'POST' });
        const { accessToken } = await response.json();

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstanceForOrval(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    sentryCaptureApiError(error);
    return Promise.reject(error);
  },
);
```

### Orval 자동 생성

#### 설정 파일
- **위치**: `/orval.config.ts`

#### 생성 결과
- **API 훅**: `/src/orval/api/{tag}/{tag}.ts` (태그별 분리, 19개+)
- **타입 정의**: `/src/orval/model/` (OpenAPI 스키마 → TypeScript, 256개+)
- **생성 명령어**: `pnpm orval` (package.json scripts)

### lib/server 또는 services 폴더

#### 사용 여부
⚠️ **제한적 사용**

- `/src/services/` 폴더 존재하지만 주요 로직은 다음 위치에 분산:
  - **Server Actions**: `/src/actions/` (서버 전용 로직)
  - **Route Handlers**: `/src/app/api/` (BFF 엔드포인트)
  - **Orval 생성 훅**: `/src/orval/api/` (클라이언트 API 호출)

---

## 7) 스타일링 규칙

### shadcn/ui 컴포넌트 위치

#### 설치 위치
- **컴포넌트**: `/src/components/{component-name}/`
- **예시**:
  - `/src/components/button/`
  - `/src/components/avatar/`
  - `/src/components/dialog/`
  - `/src/components/bottom-sheet/`

#### 컴포넌트 구조
```
components/button/
├── index.tsx              # 컴포넌트 정의
├── buttonVariants.ts      # CVA 스타일 정의
└── (button.stories.tsx)   # 옵션: Storybook
```

### Tailwind Class 관리

#### cn() 함수
- **위치**: `/src/utils/cn.ts`
- **구성**: `clsx` + `tailwind-merge`
- **용도**: 조건부 클래스 + Tailwind 클래스 충돌 해결

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### 사용 예시
```tsx
<button
  className={cn(
    'px-4 py-2 bg-blue-500',
    isActive && 'bg-green-500',  // 조건부 클래스
    className                     // 외부 주입 클래스
  )}
>
  Click me
</button>
```

#### class-variance-authority (CVA) 사용

**위치**: 각 컴포넌트의 `{name}Variants.ts` 파일

**패턴**:
```typescript
// src/components/button/buttonVariants.ts
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  // Base styles (항상 적용)
  'inline-flex items-center justify-center transition-all outline-none disabled:opacity-40',
  {
    variants: {
      size: {
        L: 'max-h-15 px-5 py-4.5 rounded-2xl gap-2.5 typo-b1-semibold',
        M: 'h-fit py-2 px-3 rounded-xl gap-1.5 typo-b2-semibold',
        S: 'h-fit py-2 px-2 rounded-xl gap-1.5 typo-label-semibold',
      },
      color: {
        primary: '',
        secondary: '',
        negative: '',
      },
      variant: {
        default: '',
        round: 'rounded-full p-5',
        linear: 'border bg-transparent',
        text: 'bg-transparent border-none text-gray-900',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        color: 'primary',
        className: 'text-white bg-primary border-primary',
      },
      {
        variant: 'linear',
        color: 'primary',
        className: 'text-primary border-primary',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'S',
      color: 'primary',
    },
  },
);
```

**컴포넌트에서 사용**:
```tsx
// src/components/button/index.tsx
import { buttonVariants } from './buttonVariants';

export const Button = ({ variant, size, color, className, ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ size, color, variant }), className)}
      {...props}
    />
  );
};
```

### 디자인 토큰/테마 관리

#### Tailwind CSS v4
- **설정 파일**: `postcss.config.mjs`
- **버전**: Tailwind CSS v4 (최신)
- **PostCSS 플러그인**: `@tailwindcss/postcss`

#### CSS 변수 사용
- **다크모드 지원**: `next-themes` 라이브러리
- **CSS 변수 패턴**: `var(--{token-name})`
  ```tsx
  className="bg-[var(--status-negative)] border-[var(--status-negative)]"
  ```

#### 커스텀 타이포그래피
- **위치**: `tailwind.config.ts` (추정) 또는 global CSS
- **패턴**: `typo-{variant}-{weight}` 클래스
  - `typo-h2-semibold`: 헤딩 2 + SemiBold
  - `typo-b1-semibold`: Body 1 + SemiBold
  - `typo-b2-semibold`: Body 2 + SemiBold
  - `typo-label-semibold`: Label + SemiBold

#### 폰트 설정
- **한글**: Pretendard (가변 폰트)
- **브랜드**: Toss Face (가변 폰트)
- **로딩 위치**: `app/[locale]/layout.tsx`
  ```tsx
  import localFont from 'next/font/local';

  const pretendard = localFont({
    src: '../assets/fonts/PretendardVariable.woff2',
    variable: '--font-pretendard',
  });

  const tossFace = localFont({
    src: '../assets/fonts/TossFaceVariable.woff2',
    variable: '--font-toss-face',
  });

  <body className={cn(pretendard.variable, tossFace.variable)}>
  ```

---

## 8) 환경변수/설정 관리

### env 파일 관리

#### 파일 구조
- `.env.local` (로컬 개발, gitignore)
- `.env.development` (개발 환경)
- `.env.staging` (스테이징 환경)
- `.env.production` (프로덕션 환경)

#### 주요 환경변수
```bash
# API
NEXT_PUBLIC_API_BASE_URL=https://global-app.dev.sokind.services

# 환경 구분
NEXT_PUBLIC_APP_ENV=development  # development | staging | production

# Sentry
NEXT_PUBLIC_SENTRY_DSN=...
SENTRY_ORG=...
SENTRY_PROJECT=...

# CDN/Storage
NEXT_PUBLIC_S3_BUCKET_DEV=...
NEXT_PUBLIC_S3_BUCKET_STAGE=...
NEXT_PUBLIC_S3_BUCKET_PROD=...
```

### Config 폴더 사용

#### 위치
- `/src/constants/env-urls.ts`

#### 패턴
```typescript
// src/constants/env-urls.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'development';

export const S3_BUCKET = {
  dev: process.env.NEXT_PUBLIC_S3_BUCKET_DEV,
  stage: process.env.NEXT_PUBLIC_S3_BUCKET_STAGE,
  prod: process.env.NEXT_PUBLIC_S3_BUCKET_PROD,
}[APP_ENV];
```

#### Cookie 설정
```typescript
// src/constants/cookie-names.ts
export const SOKIND_ACCESS_TOKEN_COOKIE = 'SOKIND_ACCESS_TOKEN_COOKIE';
export const SOKIND_REFRESH_TOKEN_COOKIE = 'SOKIND_REFRESH_TOKEN_COOKIE';
```

### Next.js 설정

#### next.config.ts
```typescript
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,           // React Compiler 활성화
  output: 'standalone',          // Docker 배포용
  experimental: {
    turbo: true,                 // Turbopack 사용
  },

  // i18n (next-intl)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
      },
    ];
  },

  // CDN 설정
  images: {
    domains: ['sokind-dev.s3.ap-northeast-2.amazonaws.com'],
  },

  // Sentry (조건부)
  sentry: process.env.NEXT_PUBLIC_APP_ENV !== 'development' ? {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  } : undefined,
};

export default nextConfig;
```

---

## 9) 테스트/린트/포맷

### ESLint 규칙

#### 설정 파일
- **위치**: `/eslint.config.mjs`
- **형식**: Flat Config (ESLint v9+)

#### 주요 규칙
```javascript
// eslint.config.mjs
import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Import 정렬
      'import/order': 'off',
      'simple-import-sort/imports': ['error', {
        groups: [
          ['^react', '^next'],              // 1. React/Next
          ['^@?\\w'],                        // 2. 외부 패키지
          ['^@/'],                           // 3. Alias import (@/)
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // 4. 부모 디렉토리 (..)
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // 5. 현재 디렉토리 (.)
          ['^.+\\.s?css$'],                  // 6. CSS imports
        ],
      }],
      'simple-import-sort/exports': 'error',

      // TypeScript
      '@typescript-eslint/no-unused-vars': 'error',

      // React
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'off',

      // Next.js
      '@next/next/no-page-custom-font': 'off',
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.next/**',
      'src/orval/**',
      'src/storybook/**',
      '.storybook/**',
    ],
  },
]);
```

### Prettier 규칙

#### 설정 파일
- **위치**: `/.prettierrc`

#### 설정
```json
{
  "semi": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true
}
```

### Import 정렬 규칙

#### 순서
1. **React/Next**: `react`, `next`
2. **외부 패키지**: `@tanstack/react-query`, `zustand`, etc.
3. **Alias import**: `@/components`, `@/hooks`, `@/orval`
4. **상대 경로 (부모)**: `../../utils`
5. **상대 경로 (현재)**: `./components`
6. **CSS imports**: `./styles.css`

#### 예시
```typescript
// ✅ Good
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

import { Button } from '@/components/button';
import { useOverlay } from '@/hooks/use-overlay';
import { useGetAiRolePlayCourseList } from '@/orval/api/ai-role-play/ai-role-play';

import { formatDate } from '../../utils/format-date';

import { CourseCard } from './course-card';
import styles from './styles.module.css';
```

### Absolute Import Alias

#### tsconfig.json 설정
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 사용 규칙
- **절대 경로 사용**: `@/` 프리픽스
- **상대 경로 금지**: 3단계 이상 `../../../` 금지
- **예외**: 같은 디렉토리 내 파일은 `./` 허용

```typescript
// ✅ Good
import { Button } from '@/components/button';
import { useOverlay } from '@/hooks/use-overlay';
import { CourseCard } from './course-card';

// ❌ Bad
import { Button } from '../../../components/button';
```

---

## 10) 실제 예시 3개

### (A) React Query로 리스트 조회하는 코드 예시

#### 파일: `/src/screens/main/training/ai-role-play/courses/_components/ai-role-play-courses.tsx`

```tsx
'use client';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import Empty from '@/components/empty';
import { MINUTE } from '@/constants/time-format';
import useObserverForInfinity from '@/hooks/use-observer-for-infinity';
import useScrollRestore from '@/hooks/use-scroll-restore';
import { useTranslation } from '@/hooks/use-translations';
import { useGetAiRolePlayCourseListInfinite } from '@/orval/api/ai-role-play/ai-role-play';
import {
  CourseListResponse,
  GetAiRolePlayCourseListParams,
} from '@/orval/model';

import AIRolePlayCourseCard from './ai-role-play-course-card';
import AiRolePlaySkeletons from './ai-role-play-course-skeletons';

const AIRolePlayCourses = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get('title');
  const gender = searchParams.get('gender');
  const age = searchParams.get('age');
  const categoryId = searchParams.get('categoryId');
  const t = useTranslation();

  const emptyContent = !!title?.trim()
    ? {
        title: t('검색_결과가_없어요'),
        subTitle: t('다른_검색어를_입력해주세요'),
      }
    : {};

  const courseListParams = {
    size: 20,
    title: title || undefined,
    age: age || undefined,
    categoryId: categoryId || undefined,
    gender: gender || undefined,
  } as GetAiRolePlayCourseListParams;

  const { onSaveScrollRestore } = useScrollRestore();

  // Infinite Query 사용
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } =
    useGetAiRolePlayCourseListInfinite(courseListParams, {
      query: {
        staleTime: MINUTE * 3, // 3분 캐시
        getNextPageParam: (lastPage: CourseListResponse) => {
          const { page = 0, totalPages = 0 } = lastPage?.data ?? {};
          return totalPages <= page ? undefined : page + 1;
        },
      },
    });

  // 모든 페이지 데이터 평탄화
  const pages = useMemo(
    () => data?.pages.flatMap((page) => page.data?.content ?? []) ?? [],
    [data?.pages],
  );

  // Intersection Observer로 무한 스크롤
  const listObserveRef = useObserverForInfinity(
    useCallback(
      async (entry) => {
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      [hasNextPage, isFetching, fetchNextPage],
    ),
    { threshold: 0.3 },
  );

  const handleSaveScrollPosition = () => {
    onSaveScrollRestore();
  };

  return (
    <div className="flex flex-col gap-4 pb-10">
      {isLoading && <AiRolePlaySkeletons />}
      {pages.length ? (
        pages?.map((course) => (
          <AIRolePlayCourseCard
            key={course.courseInfo?.publicId}
            course={course}
            onSaveScrollPosition={handleSaveScrollPosition}
          />
        ))
      ) : (
        <Empty {...emptyContent} />
      )}

      {hasNextPage && (
        <div ref={listObserveRef}>
          <AiRolePlaySkeletons length={2} />
        </div>
      )}
    </div>
  );
};

export default AIRolePlayCourses;
```

#### 핵심 포인트
1. **Orval 자동 생성 훅 사용**: `useGetAiRolePlayCourseListInfinite`
2. **Infinite Query 패턴**: `getNextPageParam`으로 다음 페이지 결정
3. **데이터 평탄화**: `useMemo`로 모든 페이지 데이터 병합
4. **무한 스크롤**: Intersection Observer 활용
5. **StaleTime 설정**: 3분 캐시 유지
6. **로딩/빈 상태 처리**: Skeleton + Empty 컴포넌트

---

### (B) Zustand Store 예시

#### 파일: `/src/stores/use-overlay-store.ts`

```typescript
import { create } from 'zustand';
import { VariantProps } from 'class-variance-authority';

import { buttonVariants } from '@/components/button/buttonVariants';

export type OverlayTypes = 'toast' | 'dialog' | 'bottomSheet';
export type OverlayLayoutTypes = 'default' | 'confirm';
export type ButtonTypes = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>;

export type CommonOverlayType = {
  isOpen: boolean;
  className?: string;
  canBackdropClose?: boolean;
  contents?: {
    title?: string;
    description?: string;
  };
  buttons?: {
    subButtonProps?: ButtonTypes;
    mainButtonProps?: ButtonTypes;
  };
};

export type DialogPropsType = CommonOverlayType & {
  type?: OverlayLayoutTypes | 'confirm-negative';
  showCloseButton?: boolean;
  contents?: CommonOverlayType['contents'] & {
    imageUrl?: string;
    imageSize?: number;
    emoji?: string;
    emojiSize?: number;
    customContent?: React.ReactNode;
  };
};

export type BottomSheetPropsType = CommonOverlayType & {
  type?: OverlayLayoutTypes | 'info';
  contents?: CommonOverlayType['contents'] & {
    emoji?: string;
    emojiSize?: number;
    content?: React.ReactNode;
  };
};

interface OverlayStateType {
  props: { dialog: DialogPropsType; bottomSheet: BottomSheetPropsType };
  updateOverlayProps: (
    type: OverlayTypes,
    props: DialogPropsType | BottomSheetPropsType,
  ) => void;
  closeOverlay: (type: OverlayTypes) => void;
}

export const useOverlayStore = create<OverlayStateType>((set) => ({
  props: {
    bottomSheet: { isOpen: false },
    dialog: { isOpen: false },
  },

  updateOverlayProps: (type, newDialogProps) =>
    set((state) => ({
      ...state,
      props: { ...state.props, [String(type)]: newDialogProps },
    })),

  closeOverlay: (type: OverlayTypes) =>
    set((state) => ({
      ...state,
      props: { ...state.props, [String(type)]: { isOpen: false } },
    })),
}));
```

#### 사용 예시
```tsx
// 컴포넌트에서 사용
import { useOverlayStore } from '@/stores/use-overlay-store';

const MyComponent = () => {
  const { updateOverlayProps, closeOverlay } = useOverlayStore();

  const handleOpenDialog = () => {
    updateOverlayProps('dialog', {
      isOpen: true,
      type: 'confirm',
      contents: {
        title: '정말 삭제하시겠습니까?',
        description: '삭제된 데이터는 복구할 수 없습니다.',
      },
      buttons: {
        subButtonProps: {
          children: '취소',
          onClick: () => closeOverlay('dialog'),
        },
        mainButtonProps: {
          children: '삭제',
          color: 'negative',
          onClick: handleDelete,
        },
      },
    });
  };

  return <button onClick={handleOpenDialog}>삭제</button>;
};
```

#### 핵심 포인트
1. **TypeScript 타입 안전성**: 모든 props 타입 정의
2. **단일 책임**: 오버레이 상태만 관리
3. **불변성 유지**: spread operator로 상태 업데이트
4. **간단한 API**: `updateOverlayProps`, `closeOverlay`
5. **Persist 미사용**: 세션 종료 시 초기화 (ephemeral state)

---

### (C) shadcn 컴포넌트를 페이지에서 사용하는 예시

#### 파일: `/src/screens/main/home/_components/popular-courses-section.tsx`

```tsx
import { useState } from 'react';
import Image from 'next/image';

import bookImage from '@/assets/images/book.png';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { trainingMapper } from '@/constants/training-mapper';
import { useTranslation } from '@/hooks/use-translations';
import {
  useGetAvailableTrainingTypes,
  useGetMostPopularCoursesByTrainingType,
} from '@/orval/api/home/home';
import { TrainingTypeFilter } from '@/orval/model';
import TrainingList from '@/screens/main/training/_components/training-list';
import { cn } from '@/utils/cn';

const PopularCoursesSection = () => {
  const t = useTranslation();
  const { data: trainings } = useGetAvailableTrainingTypes();
  const [category, setCategory] = useState<TrainingTypeFilter>('ALL');
  const { data, refetch } = useGetMostPopularCoursesByTrainingType(category, {
    query: { enabled: !!category },
  });

  const categoriesExcludeRehearsal = trainings?.data?.list?.filter(
    (item) => item !== 'REHEARSAL',
  );

  const handleChangeCategory = (value: TrainingTypeFilter) => () => {
    setCategory(value);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="px-5">
      <div className="w-full rounded-3xl bg-gray-50 border border-gray-200 p-5 gap-7 flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <p className="typo-h2-semibold">{t('지금_가장_인기있는_교육')}</p>
          <Button
            variant="text"
            className="p-0"
            color="secondary"
            onClick={handleRefresh}
          >
            <Icon shape="repeat3" size="M" />
          </Button>
        </div>

        <div className="flex flex-1 gap-2 flex-row flex-wrap">
          <Button
            size="M"
            color="secondary"
            className={cn(
              'flex flex-row gap-2',
              category === 'ALL' && 'bg-gray-900 text-gray-50 border-gray-900',
            )}
            onClick={handleChangeCategory('ALL')}
          >
            <Image alt="total" src={bookImage} width={20} height={20} />
            {t('전체')}
          </Button>

          {categoriesExcludeRehearsal?.map((item) => (
            <Button
              size="M"
              className={cn(
                'flex flex-row gap-2',
                category === item && 'bg-gray-900 text-gray-50 border-gray-900',
              )}
              color="secondary"
              key={item}
              onClick={handleChangeCategory(item)}
            >
              <Image
                alt={trainingMapper[item].id}
                src={trainingMapper[item].image}
                width={20}
                height={20}
              />
              {t(trainingMapper[item].title)}
            </Button>
          ))}
        </div>

        <TrainingList list={data?.data?.list ?? []} className="min-h-100" />
      </div>
    </div>
  );
};

export default PopularCoursesSection;
```

#### shadcn Button 컴포넌트 정의

**파일: `/src/components/button/index.tsx`**
```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';

import { Spinner } from '@/components/spinner';
import { cn } from '@/utils/cn';
import { Icon } from '../icon';
import { IconNameTypes } from '../icon/iconTypes';
import { buttonVariants } from './buttonVariants';

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: IconNameTypes;
    isLoading?: boolean;
  };

const Button = ({
  className,
  variant = 'default',
  size = 'L',
  color = 'primary',
  asChild = false,
  children,
  icon,
  isLoading,
  disabled,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ size, color, variant }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Spinner className="text-gray-400!" />
      ) : (
        icon && <Icon shape={icon} className={cn(color)} />
      )}
      {variant !== 'round' && children}
    </Comp>
  );
};

export { Button };
```

**파일: `/src/components/button/buttonVariants.ts`**
```typescript
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 active:text-current/50',
  {
    variants: {
      size: {
        L: 'max-h-15 px-5 text-center rounded-2xl gap-2.5 w-fit typo-b1-semibold py-4.5',
        M: 'h-fit py-[8px] px-[12px] rounded-[12px] gap-1.5 w-fit typo-b2-semibold',
        S: 'h-fit py-[8px] px-[8px] rounded-[12px] gap-1.5 w-fit typo-label-semibold',
      },
      color: {
        primary: '',
        secondary: '',
        negative: '',
      },
      variant: {
        default: '',
        round: 'rounded-full p-5',
        linear: 'border bg-transparent dark:bg-transparent',
        text: 'bg-transparent dark:bg-transparent border-none text-gray-900',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        color: 'primary',
        className: 'text-white bg-primary border border-primary',
      },
      {
        variant: 'linear',
        color: 'primary',
        className: 'text-primary border-primary',
      },
      {
        variant: 'text',
        color: 'secondary',
        className: 'text-gray-900',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'S',
      color: 'primary',
    },
  },
);
```

#### 핵심 포인트
1. **shadcn 컴포넌트 사용**: `Button` 컴포넌트 import (`@/components/button`)
2. **CVA Variants**: `size`, `color`, `variant` 조합
3. **cn() 함수**: 조건부 스타일링 (`category === 'ALL' && '...'`)
4. **Radix UI Slot**: `asChild` prop으로 다형성 지원
5. **커스텀 props**: `icon`, `isLoading` 등 추가 기능
6. **타입 안전성**: `VariantProps<typeof buttonVariants>`로 자동 타입 추론
7. **접근성**: `disabled`, `aria-*` 속성 지원

---

## 추가 규칙

### Event Handler Naming
- **내부 핸들러**: `handle{Action}` (예: `handleClick`, `handleSubmit`)
- **외부 콜백 (props, hook return)**: `on{Action}` (예: `onClick`, `onSubmit`)

```tsx
// Hook
const useExample = () => {
  const handleSubmit = () => { /* 내부 로직 */ };
  return { onSubmit: handleSubmit }; // 외부로 노출
};

// Component
interface Props {
  onClick: () => void; // 외부 콜백
}

const MyComponent = ({ onClick }: Props) => {
  const handleClick = () => { // 내부 핸들러
    // 내부 로직
    onClick(); // 외부 콜백 호출
  };
  return <button onClick={handleClick}>Click</button>;
};
```

### Early Return 패턴
비즈니스 로직에서 불필요한 실행 방지를 위해 적극 활용

```tsx
// ✅ Good
const processUser = (user?: User) => {
  if (!user) return;
  if (!user.isActive) return;

  // 핵심 로직
};

// ❌ Bad
const processUser = (user?: User) => {
  if (user) {
    if (user.isActive) {
      // 핵심 로직
    }
  }
};
```

---

## 검증 체크리스트

dev-growth-tracker에 적용 시 확인할 항목:

- [ ] 폴더 구조가 `screens/`, `components/`, `lib/`, `stores/` 3계층으로 분리되었는가?
- [ ] 페이지 전용 코드가 `_components/`, `_hooks/`, `_types/` 폴더에 있는가?
- [ ] Orval로 API 클라이언트를 자동 생성하도록 설정했는가?
- [ ] React Query의 staleTime이 적절하게 설정되었는가?
- [ ] Zustand Store가 UI 상태/디바이스 정보/세션 데이터에만 사용되는가?
- [ ] shadcn/ui 컴포넌트가 CVA로 스타일링되었는가?
- [ ] ESLint import 정렬 규칙이 적용되었는가?
- [ ] 절대 경로 alias (`@/`)가 설정되었는가?
- [ ] Route Groups으로 인증/비인증 경로가 분리되었는가?
- [ ] 파일 네이밍이 kebab-case를 따르는가?
- [ ] 타입 정의에 `Type` 접미사가 붙어있는가?
- [ ] Event Handler가 `handle*/on*` 규칙을 따르는가?

---

## 기술 스택 요약

| 카테고리 | 기술 | 버전/설명 |
|---------|------|----------|
| **Framework** | Next.js | v16.1.6 (App Router) |
| **React** | React | v19+ (React Compiler) |
| **언어** | TypeScript | Strict mode |
| **스타일링** | Tailwind CSS | v4 |
| **컴포넌트** | shadcn/ui + Radix UI | - |
| **스타일 변형** | class-variance-authority | CVA |
| **서버 상태** | TanStack Query | v5 |
| **클라이언트 상태** | Zustand | - |
| **HTTP 클라이언트** | Axios | - |
| **API 코드 생성** | Orval | OpenAPI → React Query |
| **i18n** | next-intl | 5개 언어 |
| **폰트** | Pretendard, Toss Face | 가변 폰트 |
| **패키지 관리자** | pnpm | v9.0.5 |
| **린트** | ESLint | Flat config |
| **포맷** | Prettier | - |
| **에러 트래킹** | Sentry | - |
| **번들러** | Turbopack | - |

---

## 다음 단계

이 문서를 dev-growth-tracker 프로젝트에 적용하려면:

1. **프로젝트 초기화**
   ```bash
   npx create-next-app@latest dev-growth-tracker --typescript --tailwind --app
   cd dev-growth-tracker
   pnpm install
   ```

2. **폴더 구조 생성**
   ```bash
   mkdir -p src/{screens,components,hooks,stores,lib,orval,actions,constants,types,utils,providers,assets}
   ```

3. **설정 파일 복사**
   - `tsconfig.json`, `.prettierrc`, `eslint.config.mjs`
   - `orval.config.ts`, `next.config.ts`

4. **필수 패키지 설치**
   ```bash
   pnpm add @tanstack/react-query zustand axios class-variance-authority clsx tailwind-merge
   pnpm add -D orval @tailwindcss/postcss
   ```

5. **shadcn/ui 초기화**
   ```bash
   pnpm dlx shadcn@latest init
   ```

6. **Orval 설정 및 실행**
   - OpenAPI spec URL 설정
   - `pnpm orval` 실행

7. **프로바이더 설정**
   - ReactQueryProvider
   - 기타 Context Provider

이 문서를 `/docs/architecture.md`로 저장하여 팀원들과 공유하세요.
