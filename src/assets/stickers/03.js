import * as React from "react";
import Svg, { Path, G } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={69}
    height={68}
    viewBox="0 0 69 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M33.3861 65.9937C33.0249 65.9937 32.6637 65.9873 32.3025 65.9747C32.2771 65.9747 32.2074 65.9715 32.1979 65.9715C31.9223 65.962 31.6498 65.9461 31.3741 65.9271C31.3583 65.9271 31.2284 65.9176 31.2125 65.9145C28.6587 65.7434 26.1335 65.2617 23.7064 64.4823C23.6747 64.4728 23.5638 64.4379 23.548 64.4316C22.8002 64.1908 22.0176 63.9025 21.2382 63.5825C21.1938 63.5634 21.1463 63.5444 21.0956 63.5223C19.749 62.9583 18.4246 62.2961 17.1667 61.5578C17.116 61.5293 17.059 61.4944 17.0019 61.4564C16.9322 61.4184 16.8783 61.3835 16.8403 61.3614C16.3017 61.0318 15.8201 60.7245 15.367 60.414C15.3638 60.414 15.3575 60.4076 15.3543 60.4045C15.3226 60.3855 15.2878 60.3633 15.2593 60.3411C13.092 58.8456 11.1307 57.1093 9.43243 55.1765C9.35956 55.1036 9.29935 55.0339 9.255 54.9769C8.15554 53.7127 7.14162 52.3407 6.24495 50.8927L6.20693 50.8325C6.1594 50.7565 6.11187 50.6836 6.06751 50.6076C2.92122 45.4208 1.3243 39.5179 1.42569 33.4661C1.39401 33.4439 1.3655 33.4249 1.33381 33.4027C0.259699 32.6296 -0.231416 31.2038 0.104442 29.8604C0.278708 29.1602 0.66209 28.5138 1.21024 27.9815C1.16905 27.9213 1.12785 27.8611 1.08983 27.8009C0.237513 26.4796 0.113956 24.8479 0.766662 23.5424C1.36867 22.3448 2.62339 21.4798 4.05554 21.2707C4.57834 20.0698 5.18034 18.8848 5.85206 17.7473C5.8584 17.7346 5.9281 17.6237 5.9281 17.6237C5.96612 17.5509 6.00732 17.4812 6.05167 17.4146C7.06559 15.7448 8.21574 14.1796 9.47679 12.757C9.48313 12.7506 9.48629 12.7443 9.49263 12.738C9.53382 12.6904 9.57502 12.6429 9.61938 12.5985C9.74929 12.4528 9.87919 12.3102 10.0154 12.1676C10.6967 11.4294 11.4286 10.7165 12.1922 10.0448C12.2429 9.99723 12.2904 9.95603 12.3379 9.91167C12.3823 9.87048 12.4266 9.83246 12.471 9.79444C12.5597 9.71523 12.6516 9.63919 12.7435 9.56315C12.791 9.51879 12.829 9.4871 12.8512 9.47126C14.5749 8.02643 16.4538 6.76538 18.4309 5.72296C18.5006 5.68177 18.5671 5.65008 18.6242 5.62473C19.1311 5.35541 19.6761 5.09243 20.2845 4.81677C20.3035 4.80727 20.3922 4.77241 20.3922 4.77241C20.8199 4.58231 21.2318 4.40804 21.6469 4.24961C21.6944 4.22743 21.7515 4.20526 21.8148 4.18308C21.8909 4.15139 21.9669 4.12287 22.043 4.09436C22.1032 4.06901 22.1665 4.04683 22.2299 4.02782C23.5923 3.5177 24.977 3.1058 26.3489 2.79529C26.3901 2.78578 26.4313 2.77627 26.4725 2.76994C28.288 2.3612 30.1542 2.11406 32.0268 2.03168C32.0807 2.02851 32.1314 2.02534 32.1852 2.02534C32.6098 2.0095 33.0407 2 33.4653 2C33.6618 2 33.8614 2 34.0578 2.00633C34.0642 2.00633 34.1909 2.00633 34.2099 2.00633C35.6516 2.04436 37.0805 2.17426 38.4493 2.38972C38.4747 2.39289 38.5412 2.40556 38.5507 2.40556C40.7813 2.76994 42.9707 3.36878 45.0556 4.18624C45.0809 4.19575 45.1063 4.20525 45.1348 4.21476C45.1791 4.2306 45.2172 4.24645 45.2584 4.26546C45.9491 4.54111 46.6303 4.84212 47.283 5.15896C47.3591 5.19065 47.4288 5.2255 47.4985 5.26352C47.6189 5.32056 47.7393 5.38076 47.8597 5.44096C47.8882 5.45363 47.9832 5.50116 48.0023 5.51066C48.6074 5.82434 49.1556 6.12535 49.6784 6.43269C50.8222 7.10758 51.9122 7.84583 52.9166 8.62211C53.433 9.015 53.9495 9.43641 54.4786 9.899C54.5452 9.95604 54.6149 10.0162 54.6814 10.0733C54.7606 10.143 54.8398 10.2127 54.9159 10.2856C54.9349 10.3046 54.9539 10.3236 54.9729 10.3426C55.1979 10.5485 55.4355 10.764 55.67 10.9953C55.803 11.122 55.9361 11.2519 56.0692 11.385C56.1516 11.4611 56.215 11.5276 56.2593 11.5783C58.943 14.3032 61.0817 17.4431 62.6374 20.9316C62.9321 20.8809 63.2236 20.8588 63.5119 20.8588C63.5563 20.8588 63.6007 20.8588 63.645 20.8588C65.1215 20.8968 66.4967 21.6382 67.2286 22.7915C68.0112 24.0241 68.0492 25.6622 67.3331 27.0626C67.3014 27.126 67.2666 27.1894 67.2317 27.2527C67.8306 27.7312 68.2742 28.3363 68.5181 29.0144C68.9871 30.3198 68.6385 31.7868 67.65 32.6613C66.9085 33.3172 66.0055 33.4851 65.4257 33.5295C65.4352 34.2044 65.4257 34.8793 65.394 35.5478V35.5922C65.3908 35.6524 65.3877 35.7094 65.3813 35.7696C65.1279 40.4684 63.8605 44.9677 61.614 49.1406C61.5855 49.1976 61.557 49.2514 61.5253 49.3053C61.4936 49.3655 61.3162 49.6887 61.3162 49.6887C61.2972 49.7235 61.2782 49.7616 61.256 49.7964C61.256 49.7964 61.1958 49.8978 61.1895 49.9105C61.1261 50.0246 61.0595 50.1355 60.993 50.2463C59.6559 52.5181 58.0495 54.6093 56.2245 56.4597C56.1896 56.4978 56.1452 56.5453 56.0882 56.5991C56.0882 56.5991 55.9456 56.7386 55.9266 56.7576C54.2188 58.4495 52.3146 59.9482 50.2646 61.2156C50.2234 61.241 50.1853 61.2663 50.1441 61.2917C49.5105 61.6782 48.8704 62.0426 48.2304 62.3721C48.167 62.4101 48.0973 62.445 48.0276 62.4767C46.9662 63.0216 45.835 63.5191 44.6754 63.9563C44.6152 63.9817 44.5518 64.0039 44.4884 64.026C44.4884 64.026 44.2033 64.1306 44.1304 64.1559C44.1082 64.1655 44.0132 64.1971 44.01 64.1971C42.0075 64.9005 39.9417 65.4012 37.8695 65.6863C37.8093 65.6958 37.7586 65.7053 37.7111 65.7085C37.7111 65.7085 37.7047 65.7085 37.7016 65.7085C37.0425 65.8004 36.3549 65.8701 35.6706 65.9176C35.6135 65.9208 35.566 65.924 35.5153 65.9271C34.8246 65.9746 34.1148 66 33.4083 66L33.3861 65.9937Z"
      fill="white"
    />
    <Path
      d="M63.7184 35.4559C63.7152 35.513 63.7152 35.5732 63.7088 35.6302C63.4807 39.9393 62.3147 44.2548 60.1412 48.2788C60.1316 48.3009 60.119 48.3263 60.1031 48.3485C60.0239 48.4974 59.9415 48.6431 59.8623 48.792L59.7926 48.9061C59.7229 49.0297 59.6532 49.1501 59.5803 49.2737C58.2908 51.4631 56.7699 53.4275 55.0589 55.1543C55.0367 55.1797 55.0177 55.2019 54.9924 55.224C54.967 55.2494 54.9417 55.2747 54.9163 55.3001C54.8941 55.3191 54.8751 55.3413 54.853 55.3603C53.2054 56.9984 51.393 58.4179 49.4602 59.6092C49.438 59.6251 49.4159 59.6377 49.3937 59.6504C48.7727 60.0306 48.139 60.3887 47.4926 60.7214C47.4609 60.7372 47.4356 60.7499 47.4102 60.7625C46.3614 61.3012 45.2842 61.7733 44.1815 62.1852C44.1625 62.1947 44.1372 62.2042 44.1118 62.2105C43.9661 62.2644 43.8203 62.3151 43.6778 62.369C43.6492 62.3785 43.6239 62.3848 43.6017 62.3943C41.7038 63.0597 39.7457 63.535 37.7527 63.8043C37.7274 63.8106 37.6988 63.8138 37.6735 63.817C37.0335 63.9057 36.3871 63.9722 35.7407 64.0166C35.709 64.0197 35.6837 64.0197 35.6583 64.0197C34.6381 64.0926 33.6179 64.1085 32.5944 64.0736C32.5691 64.0736 32.5406 64.0704 32.5121 64.0704C32.2522 64.0609 31.9924 64.0451 31.7326 64.0292C31.7041 64.0292 31.6756 64.0261 31.647 64.0229C29.239 63.8676 26.831 63.4177 24.4768 62.6573C24.4451 62.651 24.4198 62.6414 24.3913 62.6319C23.6562 62.3943 22.9274 62.125 22.205 61.8272C22.1733 61.8145 22.1416 61.8018 22.11 61.786C20.8394 61.2568 19.591 60.6358 18.3743 59.9197C18.3141 59.8849 18.2539 59.8469 18.1969 59.8088C18.1589 59.793 18.124 59.7708 18.0892 59.7486C17.6107 59.4571 17.1386 59.1561 16.6792 58.8424C16.6475 58.8203 16.6158 58.7981 16.581 58.7791C14.4993 57.3438 12.6457 55.6898 11.0456 53.8584C11.0108 53.8268 10.9823 53.7919 10.9537 53.7571C9.89231 52.5404 8.93861 51.2413 8.09897 49.8915C8.0451 49.806 7.99124 49.7236 7.94055 49.638C4.67385 44.2548 3.1593 37.9495 3.64725 31.6569C3.64725 31.5651 3.65992 31.47 3.66943 31.3781C3.92608 28.3902 4.63581 25.4087 5.82399 22.5349C5.83983 22.4905 5.86203 22.443 5.88104 22.3955C6.40384 21.1471 7.02167 19.9114 7.72824 18.7106C7.75993 18.6599 7.79161 18.6092 7.82329 18.5585C7.8423 18.5173 7.86449 18.4793 7.88984 18.4444C8.86573 16.8285 9.96519 15.3361 11.1755 13.9769C11.1977 13.9483 11.2231 13.923 11.2453 13.9008C11.3752 13.7551 11.5019 13.6125 11.6381 13.4731C12.2972 12.757 12.9879 12.0853 13.7103 11.4516C13.7642 11.4009 13.8149 11.3565 13.8687 11.309C13.8909 11.2868 13.9131 11.2678 13.9353 11.252C14.0399 11.1569 14.1476 11.0682 14.2553 10.9795C14.2712 10.9605 14.2933 10.9446 14.3155 10.9256C15.9568 9.5505 17.7311 8.36232 19.6005 7.3801C19.6259 7.36425 19.6512 7.35158 19.6797 7.34207C20.2152 7.05691 20.7602 6.79393 21.3115 6.54362L21.3875 6.51193C21.7963 6.32816 22.205 6.15706 22.6201 5.99864C22.6454 5.98597 22.6676 5.97646 22.6961 5.97013C22.7943 5.92894 22.8926 5.89091 22.9908 5.85289C23.013 5.84338 23.0383 5.83388 23.0668 5.82754C24.3532 5.34276 25.6713 4.94354 27.0147 4.64253C27.0401 4.6362 27.0686 4.62986 27.0908 4.62669C28.8271 4.2338 30.5983 3.99933 32.3821 3.92329C32.4107 3.92012 32.436 3.92012 32.4645 3.92012C33.0792 3.89477 33.6971 3.88844 34.3149 3.90111H34.3941C35.7281 3.93597 37.0683 4.0532 38.3991 4.26549C38.4244 4.26865 38.4498 4.27499 38.4783 4.27816C40.56 4.61718 42.6322 5.178 44.6505 5.97646C44.6758 5.98596 44.7043 5.99547 44.7297 6.00815C45.4046 6.27747 46.0763 6.57213 46.7417 6.89532C46.7765 6.90799 46.8114 6.92383 46.8399 6.94284C46.9856 7.01255 47.1282 7.08226 47.274 7.1583C47.3025 7.17098 47.331 7.18682 47.3595 7.19949C47.8887 7.47198 48.4178 7.76031 48.9374 8.06765C50.0052 8.69818 51.0223 9.38257 51.9823 10.124C52.4956 10.5137 52.9899 10.9193 53.4715 11.3407C53.5285 11.3882 53.5887 11.4389 53.6426 11.4896C53.9626 11.7716 54.2763 12.0631 54.5805 12.3641C54.723 12.4972 54.8625 12.6366 55.0019 12.776C55.0336 12.8013 55.0589 12.8299 55.0843 12.8616C61.0537 18.8975 64.1144 27.1545 63.7184 35.4559Z"
      fill="#757EA8"
    />
    <Path
      d="M7.89296 18.4443C8.85301 30.2437 9.90811 42.078 11.0456 53.8615C11.0107 53.8299 10.9822 53.795 10.9537 53.7601C9.82255 42.0495 8.77695 30.2881 7.82324 18.5616C7.84225 18.5204 7.86444 18.4824 7.88979 18.4475L7.89296 18.4443Z"
      fill="#FCE9E4"
    />
    <Path
      d="M11.2455 13.9008C11.9964 19.4456 12.4463 25.0316 12.8868 30.5321C13.644 39.9203 14.4203 49.5873 16.6794 58.8424C16.6477 58.8202 16.6129 58.798 16.5812 58.7759C14.3379 49.5429 13.5617 39.8981 12.8107 30.5352C12.3703 25.057 11.9235 19.4931 11.1758 13.9736C11.198 13.9483 11.2233 13.9198 11.2455 13.8976V13.9008Z"
      fill="#FCE9E4"
    />
    <Path
      d="M22.3126 39.0838C23.1047 46.8149 23.9158 54.7361 24.4766 62.6573C24.4481 62.6509 24.4196 62.6414 24.3942 62.6287C23.8398 54.7202 23.0255 46.8085 22.2365 39.0901C21.1719 28.6944 20.0788 18.0293 19.6035 7.37689C19.6289 7.36104 19.651 7.35154 19.6827 7.33887C20.1548 18.004 21.248 28.6785 22.3157 39.0838H22.3126Z"
      fill="#FCE9E4"
    />
    <Path
      d="M22.6962 5.97009C24.3152 20.0825 26.2734 34.2804 28.5262 48.2629C29.3912 53.6493 30.3005 58.9185 31.7327 64.0292C31.7041 64.0292 31.6756 64.026 31.6471 64.0229C30.2149 58.9121 29.3119 53.6493 28.4469 48.2756C26.191 34.2994 24.2392 20.1047 22.6201 5.99861C22.6455 5.9891 22.6708 5.97643 22.6962 5.97009Z"
      fill="#FCE9E4"
    />
    <Path
      d="M36.1051 39.1852C36.6913 45.82 37.2996 52.6829 37.6292 59.4381C37.6989 60.8735 37.7591 62.3405 37.7527 63.8075C37.7274 63.8138 37.6989 63.817 37.6735 63.8201C37.683 62.35 37.626 60.8829 37.5531 59.4413C37.2173 52.6893 36.6152 45.8264 36.0259 39.1916C35.0025 27.6172 33.9506 15.71 34.3149 3.90112C34.3403 3.90112 34.3688 3.90112 34.3942 3.90112C34.0298 15.7069 35.0817 27.614 36.1051 39.1821V39.1852Z"
      fill="#FCE9E4"
    />
    <Path
      d="M38.4781 4.27806C38.8932 19.8701 40.0244 35.6301 41.8336 51.1271C42.2803 54.9736 42.7778 58.7536 43.6776 62.3689C43.6491 62.3784 43.6269 62.3879 43.6047 62.3942C42.7017 58.7695 42.2043 54.9895 41.7575 51.1366C39.9483 35.6364 38.8235 19.8701 38.4053 4.26855C38.4306 4.26855 38.456 4.27489 38.4813 4.28123L38.4781 4.27806Z"
      fill="#FCE9E4"
    />
    <Path
      d="M55.002 12.776C55.0305 12.8013 55.059 12.8299 55.0843 12.8615C55.4139 19.9051 56.1679 26.9296 57.3371 33.8654C57.6159 35.5225 57.9265 37.2144 58.2275 38.843C58.8295 42.1097 59.4378 45.4366 59.8592 48.7889L59.7927 48.9029C59.3713 45.519 58.7566 42.1572 58.1514 38.8589C57.8504 37.2239 57.5399 35.5351 57.2611 33.8749C56.0824 26.9074 55.3283 19.8449 55.002 12.7728V12.776Z"
      fill="#FCE9E4"
    />
    <Path
      d="M44.7297 6.00813C44.565 22.8581 45.3761 39.7809 47.1536 56.4883C47.2962 57.8158 47.4483 59.2543 47.4926 60.7245C47.4641 60.7403 47.4388 60.7499 47.4134 60.7657C47.3754 59.2892 47.2201 57.838 47.0776 56.5009C45.3 39.7809 44.4889 22.8454 44.6537 5.97961C44.6759 5.98912 44.7044 5.99862 44.7297 6.0113V6.00813Z"
      fill="#FCE9E4"
    />
    <Path
      d="M47.36 7.19951C47.6895 10.181 47.9937 13.1531 48.2883 16.0871C49.6064 29.1254 50.9689 42.604 54.9168 55.2969C54.8978 55.3191 54.8756 55.3381 54.8534 55.3603C50.8928 42.6484 49.5304 29.1507 48.2059 16.0934C47.9081 13.1404 47.6071 10.1525 47.2744 7.15515C47.3029 7.16783 47.3315 7.18367 47.36 7.19951Z"
      fill="#FCE9E4"
    />
    <Path
      d="M57.0426 41.7739C57.0268 41.8531 57.0078 41.9355 56.9919 42.0147C56.8493 42.6991 56.6656 43.3803 56.4406 44.0552C55.6168 46.5551 54.2575 48.9251 52.3881 50.6836C51.1271 51.8781 49.6284 52.7907 47.9016 53.2723C47.2837 53.4434 46.6627 53.5986 46.0385 53.738C40.6648 54.9294 35.0344 54.9325 29.347 54.8502C26.8154 54.8121 24.2457 54.6822 21.7933 54.1119C20.96 53.9186 20.1394 53.6747 19.3378 53.3673C15.1871 51.7767 12.6111 48.5544 11.3374 44.711C11.0997 43.995 10.9096 43.2567 10.7607 42.5058C10.5769 41.5838 10.4629 40.6427 10.4058 39.6858C10.3742 39.1504 10.3647 38.6149 10.371 38.0763C10.4058 35.5795 10.5389 32.9592 10.954 30.3927C11.4578 27.2337 12.3735 24.1572 14.0211 21.4766C16.7935 16.9647 22.0405 14.1955 27.0562 13.0231C27.1797 12.9914 27.297 12.9534 27.4206 12.9408C36.2352 11.9744 45.3953 12.5162 51.7924 17.2657C55.2429 19.8322 56.9317 24.2459 57.5496 28.9669C58.1326 33.3901 57.7714 38.0858 57.0426 41.7739Z"
      fill="#FFCA63"
    />
    <Path
      d="M37.4746 14.8481C38.3871 15.0604 39.363 15.2663 40.2344 14.9273C40.3579 14.8798 40.4878 14.8101 40.548 14.6897C40.6716 14.4425 40.4308 14.17 40.1932 14.0306C39.3916 13.5617 38.3681 13.5522 37.4778 13.7074C36.5019 13.8754 36.4544 14.6136 37.4746 14.8513V14.8481Z"
      fill="#FCE9E4"
    />
    <Path
      d="M43.3239 15.7891C43.8435 15.9095 44.36 16.0362 44.8796 16.1408C45.3137 16.2295 45.9252 16.4228 46.3688 16.3277C46.4702 16.3056 46.5684 16.2359 46.5938 16.1345C46.6286 15.9824 46.4892 15.8493 46.3593 15.7606C45.8777 15.4437 45.301 15.2124 44.7624 15.0128C43.9449 14.7087 42.8138 14.2714 41.9393 14.5439C41.5622 14.6611 41.4545 15.035 41.7713 15.3138C42.123 15.6275 42.7852 15.6655 43.2257 15.7638C43.2605 15.7701 43.2922 15.7796 43.3271 15.7859L43.3239 15.7891Z"
      fill="#FCE9E4"
    />
    <G opacity={0.1}>
      <Path
        d="M52.3882 50.6837C51.1271 51.8782 49.6284 52.7907 47.9016 53.2723C47.2837 53.4434 46.6627 53.5987 46.0385 53.7381C40.6648 54.9294 35.0344 54.9326 29.347 54.8502C26.8154 54.8122 24.2458 54.6823 21.7934 54.112C20.9601 53.9187 20.1394 53.6747 19.3378 53.3674C15.1871 51.7768 12.6111 48.5545 11.3374 44.7111C11.0998 43.995 10.9097 43.2568 10.7607 42.5059C11.1821 42.9431 11.6257 43.3582 12.0883 43.7479C13.7106 45.142 15.561 46.2827 17.4969 47.1889C19.6927 48.2123 21.9993 48.9537 24.3535 49.5462C25.7255 49.8916 27.1132 50.1862 28.501 50.4556C33.3361 51.3934 38.2536 52.0461 43.1806 51.9321C43.6653 51.9194 44.1501 51.9004 44.6349 51.8719C47.2521 51.7261 49.8597 51.3491 52.3882 50.6837Z"
        fill="#52354E"
      />
    </G>
    <Path
      d="M23.8629 41.3335C23.7837 44.746 20.9511 47.4487 17.5386 47.3695C14.1262 47.2903 11.4235 44.4577 11.5027 41.0452C11.5819 37.6328 14.4145 34.9301 17.8269 35.0093C21.2394 35.0885 23.9421 37.9211 23.8629 41.3335Z"
      fill="#F2696A"
    />
    <Path
      d="M49.4518 46.7172C52.8417 46.3124 55.2617 43.2361 54.8568 39.8461C54.452 36.4562 51.3757 34.0362 47.9857 34.4411C44.5958 34.8459 42.1758 37.9222 42.5807 41.3122C42.9855 44.7021 46.0618 47.122 49.4518 46.7172Z"
      fill="#F2696A"
    />
    <Path
      d="M29.975 29.0113C30.0796 32.9941 26.9364 36.3051 22.9536 36.4097C18.9709 36.5142 15.6598 33.3711 15.5553 29.3883C15.4507 25.4056 18.5938 22.0945 22.5766 21.99C26.5594 21.8854 29.8704 25.0285 29.975 29.0113Z"
      fill="#FCE9E4"
    />
    <Path
      d="M29.2462 29.1761C29.3381 32.7184 26.5403 35.6651 22.9979 35.757C19.4556 35.8489 16.5121 33.0511 16.4202 29.5087C16.3283 25.9696 19.1229 23.0229 22.6652 22.931C23.3433 22.912 24.0023 23.0007 24.6234 23.1845L22.8775 26.711L26.385 24.0083C28.0643 25.1236 29.1891 27.012 29.2462 29.1792V29.1761Z"
      fill="#52354E"
    />
    <Path
      d="M53.2191 28.444C53.3237 32.4268 50.1806 35.7379 46.1978 35.8424C42.215 35.947 38.904 32.8039 38.7994 28.8211C38.6949 24.8383 41.838 21.5273 45.8208 21.4227C49.8035 21.3181 53.1146 24.4613 53.2191 28.444Z"
      fill="#FCE9E4"
    />
    <Path
      d="M52.4336 28.5202C52.5223 31.9833 49.7879 34.8666 46.3247 34.9553C42.8616 35.044 39.9846 32.3097 39.8927 28.8465C39.804 25.3865 42.5352 22.5064 45.9984 22.4145C46.6638 22.3987 47.307 22.4811 47.9121 22.6617L46.2043 26.109L49.6326 23.4664C51.2739 24.5564 52.3733 26.4036 52.4304 28.5202H52.4336Z"
      fill="#52354E"
    />
    <Path
      d="M18.4727 20.9982C19.5975 19.7625 21.4035 19.1922 23.0352 19.5534"
      stroke="#52354E"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M49.5138 20.9982C48.389 19.7625 46.5829 19.1922 44.9512 19.5534"
      stroke="#52354E"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M31.8525 32.1986C32.331 33.1492 33.3702 33.7924 34.4349 33.7924C35.4995 33.7924 36.5387 33.1523 37.0171 32.1986"
      stroke="#52354E"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.0519 27.9816C10.358 26.0298 8.82766 24.3917 6.92658 23.5648C6.201 23.2479 5.40253 23.0483 4.61675 23.1465C3.83096 23.2447 3.06104 23.6852 2.70617 24.3949C2.33229 25.1395 2.47487 26.071 2.92479 26.7712C3.37788 27.4715 4.09712 27.9594 4.86072 28.2889C4.30941 28.4442 3.69155 28.6818 3.21311 28.9923C2.73468 29.306 2.32912 29.7654 2.1897 30.3231C2.05029 30.8776 2.22139 31.5271 2.68716 31.863C3.09589 32.1577 3.64086 32.1703 4.14465 32.126C5.03499 32.0468 5.91267 31.8155 6.73013 31.4511C6.6731 31.8059 6.72695 32.2178 6.79349 32.5695C6.86002 32.9212 7.07866 33.2666 7.41769 33.387C7.63631 33.4631 7.87712 33.4377 8.09892 33.3712C9.0051 33.0955 9.56907 32.2052 9.96513 31.3433C10.4119 30.3706 10.827 29.0304 11.0551 27.9816H11.0519Z"
      fill="#FCE9E4"
    />
    <Path
      d="M57.9014 28.213C58.3956 26.201 59.7549 24.4171 61.5641 23.4064C62.2548 23.0198 63.0311 22.7378 63.8232 22.76C64.6154 22.779 65.4265 23.1402 65.8511 23.8119C66.2978 24.5153 66.2503 25.4564 65.8701 26.1978C65.4899 26.9392 64.8213 27.4969 64.0957 27.9024C64.6597 28.0007 65.2966 28.1749 65.8067 28.4379C66.3168 28.7009 66.7636 29.1191 66.96 29.6578C67.1533 30.1964 67.0487 30.8586 66.6178 31.2389C66.2408 31.5747 65.699 31.6412 65.1952 31.6444C64.3017 31.6539 63.405 31.5145 62.5527 31.2325C62.6446 31.581 62.6319 31.9929 62.6002 32.351C62.5685 32.709 62.3848 33.0734 62.0584 33.2255C61.8493 33.3237 61.6053 33.3205 61.3803 33.2762C60.452 33.0924 59.8024 32.2623 59.3208 31.4448C58.779 30.5196 58.2341 29.23 57.9014 28.2098V28.213Z"
      fill="#FCE9E4"
    />
    <Path
      d="M43.2565 9.96879C43.2565 10.593 39.3941 11.0999 34.6287 11.0999C29.8633 11.0999 26.001 10.593 26.001 9.96879C26.001 9.3446 29.8633 8.83765 34.6287 8.83765C39.3941 8.83765 43.2565 9.3446 43.2565 9.96879Z"
      stroke="#FCE9E4"
      strokeMiterlimit={10}
    />
    <Path
      d="M53.8357 11.664H45.7529C46.225 10.9194 46.8397 10.2667 47.5558 9.7566C47.5811 9.73759 47.6033 9.71858 47.6287 9.70274C47.7649 9.60769 47.9075 9.5158 48.0501 9.43025C48.424 9.20846 48.8327 9.02152 49.2636 9.0025C50.2617 8.95498 51.1203 9.87067 51.2756 10.8592C51.4879 10.5867 51.7255 10.3396 51.9822 10.1241C52.4955 10.5139 52.9897 10.9194 53.4713 11.3408C53.5284 11.3884 53.5886 11.4391 53.6424 11.4898C53.709 11.5468 53.7723 11.6038 53.8357 11.664Z"
      fill="#FCE9E4"
    />
    <Path
      d="M40.696 60.7721H28.0728C27.6957 60.7341 27.4518 60.7277 27.0811 60.8133C27.6419 60.1099 28.209 59.397 28.9251 58.852C29.6412 58.307 30.5284 57.9331 31.425 58.0155C32.6005 58.1201 33.5796 58.9661 34.302 59.8976C35.1607 59.0928 36.1429 58.3514 37.293 58.1011C38.4432 57.8508 39.793 58.2088 40.4203 59.2037C40.6896 59.6314 40.6421 60.2715 40.696 60.7721Z"
      fill="#FCE9E4"
    />
    <Path
      d="M21.2255 13.4732H11.6377C12.2967 12.7571 12.9875 12.0854 13.7099 11.4517C14.1313 11.778 14.5083 12.1773 14.8315 12.5955C15.6902 11.7907 16.6724 11.0493 17.8225 10.8021C18.4689 10.6627 19.1755 10.7103 19.7838 10.9606C19.8123 10.9701 19.8409 10.9827 19.8662 10.9954C20.3098 11.1919 20.69 11.4929 20.9498 11.9048C21.2192 12.3293 21.1716 12.9726 21.2255 13.4732Z"
      fill="#FCE9E4"
    />
    <Path
      d="M12.0559 49.714C12.0559 50.3097 11.5743 50.7913 10.9787 50.7913C10.383 50.7913 9.90137 50.3097 9.90137 49.714C9.90137 49.1183 10.383 48.6367 10.9787 48.6367C11.5743 48.6367 12.0559 49.1183 12.0559 49.714Z"
      fill="#FCE9E4"
    />
    <Path
      d="M58.1956 19.0274C58.1956 19.623 57.714 20.1046 57.1183 20.1046C56.5226 20.1046 56.041 19.623 56.041 19.0274C56.041 18.4317 56.5226 17.9501 57.1183 17.9501C57.714 17.9501 58.1956 18.4317 58.1956 19.0274Z"
      fill="#FCE9E4"
    />
    <Path
      d="M12.0813 19.0274C12.0813 19.623 11.5997 20.1046 11.004 20.1046C10.4084 20.1046 9.92676 19.623 9.92676 19.0274C9.92676 18.4317 10.4084 17.9501 11.004 17.9501C11.5997 17.9501 12.0813 18.4317 12.0813 19.0274Z"
      fill="#FCE9E4"
    />
    <Path
      d="M34.8938 6.40736C34.8938 7.00303 34.4122 7.48464 33.8165 7.48464C33.2209 7.48464 32.7393 7.00303 32.7393 6.40736C32.7393 5.81168 33.2209 5.33008 33.8165 5.33008C34.4122 5.33008 34.8938 5.81168 34.8938 6.40736Z"
      fill="#FCE9E4"
    />
    <Path
      d="M54.3108 52.3566C54.3108 52.9522 53.8292 53.4339 53.2335 53.4339C52.6378 53.4339 52.1562 52.9522 52.1562 52.3566C52.1562 51.7609 52.6378 51.2793 53.2335 51.2793C53.8292 51.2793 54.3108 51.7609 54.3108 52.3566Z"
      fill="#FCE9E4"
    />
  </Svg>
);
export default SVGComponent;
