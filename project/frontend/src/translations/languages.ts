export const translations = {
  en: {
    // auth
    //login
    title: 'Transcendence',
    formTitle: 'LOGIN',
    toggleForm: 'No account? Register',
    loginUsername: 'Enter your username',
    loginPassword: 'Enter your password',
    meetTheTeam: 'Meet the team',
    login: 'Login',
    loginFailed: 'Login failed',
    loginServerError: 'Server error',
    // register
    register: 'Register',
    goToLogin: 'Already have an account? login',
    registerUsername: 'Enter your username',
    registerPassword: 'Enter your password',
    registerEmail: 'Enter your email',
    registerMaxChars: 'The username is longer than 10 characters. Try agan!',
    invalidCredentials: 'Username or email is already in use',
    registerServerError: 'Server error',

    // landing
    welcomePrefix: 'Welcome,',
    chooseMode: 'Choose Your Game Mode',
    playSolo: 'Play solo',
    challengeFriends: 'challenge friends',
    spectate: 'or spectate epic matches',
    pickGame: 'Pick a game to get started.',
    logout: 'Log out',
    pong: 'Pong',
    snake: 'Snake',
    practiceMode: 'Practice Mode',
    aiMode: 'AI mode',
    tournamentMode: 'Tournament Mode',

    // profile
    profileHeading: 'My Profile',
    settings: 'Settings',
    friends: 'Friends',
    addFriendInput: 'Enter username',
    add: 'Add',
    gameStats: 'Game Stats',
    totalGames: 'Total Games',
    pongWins: 'Pong Wins',
    pongLosses: 'Pong Losses',
    snakeWins: 'Snake Wins',
    snakeLosses: 'Snake Losses',
    gameHistory: 'Game History',
    returnToMyProfile: 'Return to My Profile',
    return: 'Return',
    friendAlready: '{username} is already your friend',
    friendAdded: 'Friend added successfully',
    friendNotFound: 'Profile does not exist',
    noFriends: 'No friends yet',
    friendSelfError: 'You cannot add yourself as a friend',
    noGameHistory: 'No game history yet',

    // setting
    backToProfile: 'Back to Profile',
    changeUsername: 'Change Username',
    changePassword: 'Change Password',
    changeAvatar: 'Change Avatar',
    dragDropImage: 'Drag & Drop your image',
    uploadAvatar: 'Upload Avatar',
    save: 'Save',
    usernameRequired: 'Username is required.',
    usernameTaken: 'Username is already in use, try another one.',
    usernameChangeFailed: 'Username change failed',
    usernameUpdated: 'Username updated successfully.',
    passwordRequired: 'Password is required.',
    passwordChangeFailed: 'Password change failed.',
    passwordUpdated: 'Password updated successfully.',
    onlyImages: 'Only image files are allowed.',
    noImageSelected: 'No image selected.',
    imageTooBig: 'Image is too big, try uploading something up to 1MB.',
    avatarUploadFailed: 'Avatar upload failed.',
    avatarUpdated: 'Avatar updated successfully.',
    usernameTenChars: 'Username must be at least 10 characters long.',

    // pong
    start: 'START',
    back: 'Back',
    instructionsPong:
      'Up: ↑ / W\n' + 'Down: ↓ / S\n Rules: Keep the ball in play. First to 5 points wins.',
    pongMessage: 'Waiting for another player...',
    pongWinner: 'The winner is {winner}',
    pongWaitMessage: 'Waiting for another player...',

    // snake
    instructionsSnake:
      'Up: ↑ / W \n   ' +
      'Down: ↓ / S\n  ' +
      'Left: ← / A\n   ' +
      'Right: → / D\n   ' +
      'Reverse: R\n ' +
      'Rules: \n' +
      'Eat apples to grow longer.\n' +
      'Win by eating 10 apples the fastest, making your opponent crash into a wall, their own tail, or your snake.\n' +
      'If both players crash in the same frame the game restarts.',
    snakeMessage: 'Waiting to start...',
    snakeWinner: 'The winner is {winner}',

    // practice
    practice: 'Practice Mode',
    instructionsPractice:
      'Up: ↑ / W\n' + 'Down: ↓ / S\n Rules: Keep the ball in play. First to 5 points wins.',

    // ai
    ai: 'AI Mode',
    instructionsAi: 'Up: W\n ' + 'Down: S\n Rules: Keep the ball in play. First to 5 points wins.',
    aiWinner: 'The winner is {winner}',

    // tournament
    instructionsTour:
      'Up: ↑ / W\n' +
      'Down: ↓ / S\n Rules: Keep the ball in play. First to 5 points wins. Amount of players needs to be 2^n. The player pairs will be assigned randomly, the winner from each pair will move on to the next round. After the final round, the Winner is declared.',
    enterUsername: 'Enter username',
    ok: 'OK',
    tourHostTag: ' (host)',
    tourAlreadyIn: "You're already in.",
    tourUserNotRegistered: 'This user is not registered, please register first.',
    tourPlayersPowerOfTwo: 'The number of players must be a power of 2',
    tourRoundAboutToStart: 'Round {round} is about to start.',
    tourMatchIntro: 'Round {round}: Match {match}: {p1} vs {p2}\nPress OK when ready to start!',
    tourReady: 'Ready?',
    tourMaxPlayers: 'Maximum players achieved. Start Tournament',

    // credit
    creditPage: 'Credits',
    everythingBy: 'Everything by: Anna',
    donkeyBy: 'Donkey by: Lena',
    wombatBy: 'Wombat by: Jan',
    ferretBy: 'Ferret by: Djoyke',
    specialThanksText: 'Special Thanks: to everyone who distracted us',

    // etc
    serverError: 'Server error. Please try again later.',
    gameStarting: 'Game starting...',
    resetGameMessage: "You're both silly geese, resetting game...",
  },

  pl: {
    // auth
    // login
    title: 'Transcendencja',
    formTitle: 'Logowanie',
    toggleForm: 'Nie masz konta? Zarejestruj się',
    loginUsername: 'Wpisz swoją nazwę użytkownika',
    loginPassword: 'Wpisz swoje hasło',
    meetTheTeam: 'Poznaj ekipę',
    login: 'Zaloguj się',
    // register
    register: 'Zarejestruj się',
    goToLogin: 'Masz już konto? Zaloguj się',
    registerUsername: 'Wpisz swoją nazwę użytkownika',
    registerPassword: 'Wpisz swoje hasło',
    registerEmail: 'Wpisz swój e-mail',

    // landing
    welcomePrefix: 'Cześć,',
    chooseMode: 'Wybierz tryb gry',
    playSolo: 'Graj solo',
    challengeFriends: 'rzucaj wyzwania znajomym',
    spectate: 'albo oglądaj epickie mecze',
    pickGame: 'Wybierz grę, aby zacząć.',
    logout: 'Wyloguj się',
    pong: 'Pong',
    snake: 'Wąż',
    practiceMode: 'Tryb treningowy',
    aiMode: 'Tryb SI',
    tournamentMode: 'Tryb turniejowy',

    // profile
    profileHeading: 'Mój profil',
    settings: 'Ustawienia',
    friends: 'Znajomi',
    addFriendInput: 'Wpisz nazwę użytkownika',
    add: 'Dodaj',
    gameStats: 'Statystyki gier',
    totalGames: 'Łączna liczba gier',
    pongWins: 'Wygrane w Pongu',
    pongLosses: 'Przegrane w Pongu',
    snakeWins: 'Wygrane w Węża',
    snakeLosses: 'Przegrane w Węża',
    gameHistory: 'Historia gier',
    returnToMyProfile: 'Wróć do mojego profilu',
    return: 'Powrót',
    noFriends: 'Brak znajomych',
    friendSelfError: 'Nie możesz dodać siebie jako znajomego',
    friendAlready: '{username} jest już twoim znajomym',
    friendAdded: 'Znajomy został dodany',
    friendNotFound: 'Profil nie istnieje',
    noGameHistory: 'Brak historii gier',

    // settings
    backToProfile: 'Powrót do profilu',
    changeUsername: 'Zmień nazwę użytkownika',
    changePassword: 'Zmień hasło',
    changeAvatar: 'Zmień awatar',
    dragDropImage: 'Przeciągnij i upuść swój obrazek',
    uploadAvatar: 'Prześlij awatar',
    save: 'Zapisz',
    usernameRequired: 'Nazwa użytkownika jest wymagana.',
    usernameTaken: 'Nazwa użytkownika jest już zajęta, spróbuj inną.',
    usernameChangeFailed: 'Zmiana nazwy użytkownika nie powiodła się',
    usernameUpdated: 'Nazwa użytkownika została zaktualizowana.',
    passwordRequired: 'Hasło jest wymagane.',
    passwordChangeFailed: 'Zmiana hasła nie powiodła się.',
    passwordUpdated: 'Hasło zostało zaktualizowane.',
    onlyImages: 'Dozwolone są tylko pliki graficzne.',
    noImageSelected: 'Nie wybrano obrazu.',
    imageTooBig: 'Obraz jest za duży, prześlij plik do 1 MB.',
    avatarUploadFailed: 'Przesyłanie awatara nie powiodło się.',
    avatarUpdated: 'Awatar został zaktualizowany.',
    usernameTenChars: 'Nazwa użytkownika musi mieć co najmniej 10 znaków.',

    // pong
    start: 'START',
    back: 'Powrót',
    instructionsPong:
      'Góra: ↑ / W\n' +
      'Dół: ↓ / S\n Zasady: Utrzymuj piłkę w grze. Pierwszy do 5 punktów wygrywa.',
    pongMessage: 'Czekam na drugiego gracza...',
    pongWaitMessage: 'Czekam na drugiego gracza...',
    pongWinner: 'Zwycięzcą jest {winner}',

    // snake
    instructionsSnake:
      'Góra: ↑ / W \n   ' +
      'Dół: ↓ / S\n  ' +
      'Lewo: ← / A\n   ' +
      'Prawo: → / D\n   ' +
      'Odwrót: R\n ' +
      'Zasady: \n' +
      'Jedz jabłka, aby rosnąć.\n' +
      'Wygraj, jedząc 10 jabłek najszybciej, sprawiając, by przeciwnik uderzył w ścianę, swój ogon lub twojego węża.\n' +
      'Jeśli obaj gracze zderzą się w tym samym momencie, gra zaczyna się od nowa.',
    snakeMessage: 'Czekam na rozpoczęcie...',
    snakeWinner: 'Zwycięzcą jest {winner}',

    // practice
    practice: 'Tryb treningowy',
    instructionsPractice:
      'Góra: ↑ / W\n' +
      'Dół: ↓ / S\n Zasady: Utrzymuj piłkę w grze. Pierwszy do 5 punktów wygrywa.',

    // ai
    ai: 'Tryb SI',
    instructionsAi:
      'Góra: W\n ' + 'Dół: S\n Zasady: Utrzymuj piłkę w grze. Pierwszy do 5 punktów wygrywa.',
    aiWinner: 'Zwycięzcą jest {winner}',

    // tournament
    instructionsTour:
      'Góra: ↑ / W\n' +
      'Dół: ↓ / S\n Zasady: Utrzymuj piłkę w grze. Pierwszy do 5 punktów wygrywa. Liczba graczy musi być w formacie 2^n. Pary graczy zostaną przydzielone losowo, zwycięzca z każdej pary przechodzi do następnej rundy. Po finałowej rundzie zostaje ogłoszony zwycięzca.',
    enterUsername: 'Wpisz nazwę użytkownika',
    ok: 'OK',
    tourHostTag: ' (gospodarz)',
    tourAlreadyIn: 'Już jesteś zapisany.',
    tourUserNotRegistered:
      'Ten użytkownik nie jest zarejestrowany, proszę najpierw się zarejestrować.',
    tourPlayersPowerOfTwo: 'Liczba graczy musi być potęgą liczby 2',
    tourRoundAboutToStart: 'Runda {round} zaraz się zacznie.',
    tourMatchIntro:
      'Runda {round}: Mecz {match}: {p1} kontra {p2}\nNaciśnij OK, gdy będziesz gotowy do rozpoczęcia!',
    tourReady: 'Gotowy?',
    tourMaxPlayers: 'Osiągnięto maksymalną liczbę graczy. Rozpocznij turniej',

    // credit
    creditPage: 'Twórcy',
    everythingBy: 'Wszystko stworzone przez: Anna',
    donkeyBy: 'Osioł stworzony przez: Lena',
    wombatBy: 'Wombat stworzony przez: Jan',
    ferretBy: 'Fretka stworzona przez: Djoyke',
    specialThanksText: 'Specjalne podziękowania: dla wszystkich, którzy nas rozpraszali',

    // etc
    serverError: 'Błąd serwera. Spróbuj ponownie później.',
    gameStarting: 'Gra się zaczyna...',
    resetGameMessage: 'Ale z was gąski, gra się resetuje...',
  },

  ru: {
    // auth
    // login
    title: 'Трансцендентность',
    formTitle: 'Вход',
    toggleForm: 'Нет аккаунта? Зарегистрируйся',
    loginUsername: 'Введи имя пользователя',
    loginPassword: 'Введи пароль',
    meetTheTeam: 'Познакомься с командой',
    login: 'Войти',
    // register
    register: 'Регистрация',
    goToLogin: 'Уже есть аккаунт? Войди',
    registerUsername: 'Введи имя пользователя',
    registerPassword: 'Введи пароль',
    registerEmail: 'Введи свой e-mail',

    // landing
    welcomePrefix: 'Привет,',
    chooseMode: 'Выбери режим игры',
    playSolo: 'Играть в одиночку',
    challengeFriends: 'брось вызов друзьям',
    spectate: 'или смотри эпичные матчи',
    pickGame: 'Выбери игру, чтобы начать.',
    logout: 'Выйти',
    pong: 'Понг',
    snake: 'Змейка',
    practiceMode: 'Режим тренировки',
    aiMode: 'Режим ИИ',
    tournamentMode: 'Турнирный режим',

    // profile
    profileHeading: 'Мой профиль',
    settings: 'Настройки',
    friends: 'Друзья',
    addFriendInput: 'Введи имя пользователя',
    add: 'Добавить',
    // friendMessage: 'Сообщение о действии с другом...',
    gameStats: 'Статистика игр',
    totalGames: 'Всего игр',
    pongWins: 'Победы в Понге',
    pongLosses: 'Поражения в Понге',
    snakeWins: 'Победы в Змейке',
    snakeLosses: 'Поражения в Змейке',
    gameHistory: 'История игр',
    returnToMyProfile: 'Вернуться в мой профиль',
    return: 'Назад',
    noFriends: 'Пока нет друзей',
    friendSelfError: 'Нельзя добавить себя в друзья',
    friendAlready: '{username} уже в твоих друзьях',
    friendAdded: 'Друг успешно добавлен',
    friendNotFound: 'Профиль не существует',
    noGameHistory: 'История игр отсутствует',

    // settings
    backToProfile: 'Назад к профилю',
    changeUsername: 'Сменить имя пользователя',
    changePassword: 'Сменить пароль',
    changeAvatar: 'Сменить аватар',
    dragDropImage: 'Перетащи и отпусти картинку',
    uploadAvatar: 'Загрузить аватар',
    save: 'Сохранить',
    usernameRequired: 'Требуется имя пользователя.',
    usernameTaken: 'Имя пользователя уже занято, попробуй другое.',
    usernameChangeFailed: 'Не удалось изменить имя пользователя',
    usernameUpdated: 'Имя пользователя успешно обновлено.',
    passwordRequired: 'Требуется пароль.',
    passwordChangeFailed: 'Не удалось изменить пароль.',
    passwordUpdated: 'Пароль успешно обновлён.',
    onlyImages: 'Разрешены только изображения.',
    noImageSelected: 'Изображение не выбрано.',
    imageTooBig: 'Изображение слишком большое, попробуй до 1 МБ.',
    avatarUploadFailed: 'Не удалось загрузить аватар.',
    avatarUpdated: 'Аватар успешно обновлён.',
    usernameTenChars: 'Имя пользователя должно быть не короче 10 символов.',

    // pong
    start: 'СТАРТ',
    back: 'Назад',
    instructionsPong:
      'Вверх: ↑ / W\n' +
      'Вниз: ↓ / S\n Правила: Держи мяч в игре. Первый, кто наберёт 5 очков, побеждает.',
    pongMessage: 'Ожидание второго игрока...',
    pongWaitMessage: 'Ожидание второго игрока...',
    pongWinner: 'Победитель — {winner}',

    // snake
    instructionsSnake:
      'Вверх: ↑ / W \n   ' +
      'Вниз: ↓ / S\n  ' +
      'Влево: ← / A\n   ' +
      'Вправо: → / D\n   ' +
      'Разворот: R\n ' +
      'Правила: \n' +
      'Ешь яблоки, чтобы становиться длиннее.\n' +
      'Побеждай, съев 10 яблок быстрее всех, заставив соперника врезаться в стену, свой хвост или твою змею.\n' +
      'Если оба игрока врезаются в один кадр, игра начинается заново.',
    snakeMessage: 'Ожидание начала...',
    snakeWinner: 'Победитель — {winner}',

    // practice
    practice: 'Режим тренировки',
    instructionsPractice:
      'Вверх: ↑ / W\n' +
      'Вниз: ↓ / S\n Правила: Держи мяч в игре. Первый, кто наберёт 5 очков, побеждает.',

    // ai
    ai: 'Режим ИИ',
    instructionsAi:
      'Вверх: W\n ' +
      'Вниз: S\n Правила: Держи мяч в игре. Первый, кто наберёт 5 очков, побеждает.',
    aiWinner: 'Победитель — {winner}',

    // tournament
    instructionsTour:
      'Вверх: ↑ / W\n' +
      'Вниз: ↓ / S\n Правила: Держи мяч в игре. Первый, кто наберёт 5 очков, побеждает. Количество игроков должно быть в формате 2^n. Пары игроков распределяются случайным образом, победитель каждой пары проходит в следующий раунд. После финального раунда объявляется Победитель.',
    enterUsername: 'Введи имя пользователя',
    ok: 'OK',
    tourHostTag: ' (хост)',
    tourAlreadyIn: 'Ты уже участвуешь.',
    tourUserNotRegistered:
      'Этот пользователь не зарегистрирован, пожалуйста, зарегистрируйся сначала.',
    tourPlayersPowerOfTwo: 'Количество игроков должно быть степенью числа 2',
    tourRoundAboutToStart: 'Раунд {round} скоро начнётся.',
    tourMatchIntro:
      'Раунд {round}: Матч {match}: {p1} против {p2}\nНажми OK, когда будешь готов начать!',
    tourReady: 'Готов?',
    tourMaxPlayers: 'Достигнуто максимальное количество игроков. Запускай турнир',

    // credit
    creditPage: 'Авторы',
    everythingBy: 'Всё сделано: Anna',
    donkeyBy: 'Осла сделал: Lena',
    wombatBy: 'Вомбата сделал: Jan',
    ferretBy: 'Хорька сделал: Djoyke',
    specialThanksText: 'Отдельная благодарность: всем, кто нас отвлекал',

    // etc
    serverError: 'Ошибка сервера. Попробуй позже.',
    gameStarting: 'Игра начинается...',
    resetGameMessage: 'Ну вы и гусики, игра перезапускается...',
  },

  ko: {
    // auth
    // login
    title: '초월',
    formTitle: '로그인',
    toggleForm: '계정이 없으신가요? 회원가입',
    loginUsername: '사용자 이름을 입력하세요',
    loginPassword: '비밀번호를 입력하세요',
    meetTheTeam: '팀 만나기',
    login: '로그인',
    // register
    register: '회원가입',
    goToLogin: '이미 계정이 있나요? 로그인',
    registerUsername: '사용자 이름을 입력하세요',
    registerPassword: '비밀번호를 입력하세요',
    registerEmail: '이메일을 입력하세요',

    // landing
    welcomePrefix: '안녕,',
    chooseMode: '게임 모드를 선택하세요',
    playSolo: '혼자 플레이',
    challengeFriends: '친구에게 도전',
    spectate: '또는 멋진 경기를 관전',
    pickGame: '시작할 게임을 선택하세요.',
    logout: '로그아웃',
    pong: '퐁',
    snake: '스네이크',
    practiceMode: '연습 모드',
    aiMode: 'AI 모드',
    tournamentMode: '토너먼트 모드',

    // profile
    profileHeading: '내 프로필',
    settings: '설정',
    friends: '친구',
    addFriendInput: '사용자 이름 입력',
    add: '추가',
    gameStats: '게임 통계',
    totalGames: '총 게임 수',
    pongWins: '퐁 승리',
    pongLosses: '퐁 패배',
    snakeWins: '스네이크 승리',
    snakeLosses: '스네이크 패배',
    gameHistory: '게임 기록',
    returnToMyProfile: '내 프로필로 돌아가기',
    return: '돌아가기',
    noFriends: '아직 친구가 없습니다',
    friendSelfError: '자기 자신을 친구로 추가할 수 없습니다',
    friendAlready: '{username}님은 이미 친구입니다',
    friendAdded: '친구가 성공적으로 추가되었습니다',
    friendNotFound: '프로필이 존재하지 않습니다',
    noGameHistory: '아직 게임 기록이 없습니다',

    // settings
    backToProfile: '프로필로 돌아가기',
    changeUsername: '사용자 이름 변경',
    changePassword: '비밀번호 변경',
    changeAvatar: '아바타 변경',
    dragDropImage: '이미지를 드래그해서 놓으세요',
    uploadAvatar: '아바타 업로드',
    save: '저장',
    usernameRequired: '사용자 이름이 필요합니다.',
    usernameTaken: '이미 사용 중인 사용자 이름입니다. 다른 이름을 시도하세요.',
    usernameChangeFailed: '사용자 이름 변경에 실패했습니다',
    usernameUpdated: '사용자 이름이 업데이트되었습니다.',
    passwordRequired: '비밀번호가 필요합니다.',
    passwordChangeFailed: '비밀번호 변경에 실패했습니다.',
    passwordUpdated: '비밀번호가 업데이트되었습니다.',
    onlyImages: '이미지 파일만 업로드할 수 있습니다.',
    noImageSelected: '선택된 이미지가 없습니다.',
    imageTooBig: '이미지가 너무 큽니다. 1MB 이하로 업로드하세요.',
    avatarUploadFailed: '아바타 업로드에 실패했습니다.',
    avatarUpdated: '아바타가 업데이트되었습니다.',
    usernameTenChars: '사용자 이름은 최소 10자 이상이어야 합니다.',

    // pong
    start: '시작',
    back: '뒤로',
    instructionsPong:
      '위: ↑ / W\n' +
      '아래: ↓ / S\n 규칙: 공을 계속 살려두세요. 먼저 5점을 얻는 사람이 승리합니다.',
    pongMessage: '다른 플레이어를 기다리는 중...',
    pongWaitMessage: '다른 플레이어를 기다리는 중...',
    pongWinner: '우승자는 {winner}',

    // snake
    instructionsSnake:
      '위: ↑ / W \n   ' +
      '아래: ↓ / S\n  ' +
      '왼쪽: ← / A\n   ' +
      '오른쪽: → / D\n   ' +
      '반전: R\n ' +
      '규칙: \n' +
      '사과를 먹어 길어지세요.\n' +
      '10개의 사과를 가장 빨리 먹거나 상대를 벽, 자신의 꼬리, 또는 당신의 뱀에 부딪히게 하면 승리합니다.\n' +
      '두 플레이어가 같은 프레임에 충돌하면 게임이 재시작됩니다.',
    snakeMessage: '시작을 기다리는 중...',
    snakeWinner: '우승자는 {winner}',

    // practice
    practice: '연습 모드',
    instructionsPractice:
      '위: ↑ / W\n' +
      '아래: ↓ / S\n 규칙: 공을 계속 살려두세요. 먼저 5점을 얻는 사람이 승리합니다.',

    // ai
    ai: 'AI 모드',
    instructionsAi:
      '위: W\n ' + '아래: S\n 규칙: 공을 계속 살려두세요. 먼저 5점을 얻는 사람이 승리합니다.',
    aiWinner: '우승자는 {winner}',

    // tournament
    instructionsTour:
      '위: ↑ / W\n' +
      '아래: ↓ / S\n 규칙: 공을 계속 살려두세요. 먼저 5점을 얻는 사람이 승리합니다. 플레이어 수는 2^n 형태여야 합니다. 플레이어는 무작위로 짝지어지고, 각 짝의 승자가 다음 라운드로 진출합니다. 마지막 라운드 후 최종 우승자가 결정됩니다.',
    enterUsername: '사용자 이름 입력',
    ok: '확인',
    tourHostTag: ' (호스트)',
    tourAlreadyIn: '이미 참가 중입니다.',
    tourUserNotRegistered: '이 사용자는 등록되지 않았습니다. 먼저 회원가입을 해주세요.',
    tourPlayersPowerOfTwo: '플레이어 수는 2의 거듭제곱이어야 합니다',
    tourRoundAboutToStart: '{round}라운드가 곧 시작됩니다.',
    tourMatchIntro: '{round}라운드: {match}경기: {p1} vs {p2}\n준비되면 확인을 누르세요!',
    tourReady: '준비됐나요?',
    tourMaxPlayers: '최대 인원에 도달했습니다. 토너먼트를 시작하세요',

    // credit
    creditPage: '크레딧',
    everythingBy: '모든 제작: Anna',
    donkeyBy: '당나귀 제작: Lena',
    wombatBy: '웜뱃 제작: Jan',
    ferretBy: '페럿 제작: Djoyke',
    specialThanksText: '특별 감사: 우리를 방해한 모든 분들께',

    // etc
    serverError: '서버 오류입니다. 나중에 다시 시도하세요.',
    gameStarting: '게임이 시작됩니다...',
    resetGameMessage: '둘 다 바보 거위네, 게임을 다시 시작합니다...',
  },
};
