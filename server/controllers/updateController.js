import fs from "fs/promises";
import path, { dirname } from "path";
import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Champion from "../models/Champion.js";
import Profile from "../models/Profile.js";
import { fileURLToPath } from "url";

// 이미지 있는지 체크
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath); // 파일 접근 가능 여부 확인
    return true; // 파일이 존재하면 true 반환
  } catch {
    return false; // 파일이 없으면 false 반환
  }
};

// S3 설정
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// champ 업뎃 함수
const ChampionUpdate = async (req, res) => {
  try {
    // API 요청 보내기 [ 버전 ]
    const { data: versions } = await axios.get(
      "https://ddragon.leagueoflegends.com/api/versions.json"
    );
    const latestVersion = versions[0];
    // 챔피언 정보 가져오기
    const { data: championsData } = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/ko_KR/champion.json`
    );
    const champions = Object.values(championsData.data);

    // __dirname을 file:// URL에서 추출하는 방식
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // champ_img 폴더가 들어갈 정확한 경로
    const baseDir = path.join(__dirname, "..", "static", "champ_img");

    try {
      // 'champion' 폴더가 없으면 생성
      await fs.access(baseDir); // 폴더 존재 여부 확인
      console.log("champion 폴더가 이미 존재합니다.");
    } catch (err) {
      // 폴더가 없으면 생성
      await fs.mkdir(baseDir, { recursive: true }); // recursive: true를 사용하여 상위 폴더까지 자동 생성
      console.log("champion 폴더가 생성되었습니다.");
    }

    // 각 챔피언 이미지 다운 및 s3 업로드
    for (const champ of champions) {
      const champKey = champ.key;
      const champName = champ.id;
      const champKoName = champ.name;
      const champImageUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champName}.png`;
      const localFilePath = path.resolve(baseDir, `${champName}.png`);

      if (await fileExists(localFilePath)) {
        console.log(`이미 존재하는 파일: ${champName}.png - 다운로드 건너뜀`);
        continue; // 파일이 이미 존재하면 다음 챔피언으로 넘어감
      }

      console.log(`${champName} 이미지 다운로드 중...`);

      // 4-1. 이미지 다운로드
      const { data: imageStream } = await axios.get(champImageUrl, {
        responseType: "arraybuffer",
      });
      await fs.writeFile(localFilePath, imageStream);

      // db 데이터 존재확인 후 있으면 x
      const existChampion = await Champion.findOne({
        where: { champKey: champKey },
      });

      if (!existChampion) {
        // s3 업로드
        const s3Key = `champion/${champName}.png`;
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
            Body: imageStream,
            ContentType: "image/png",
          })
        );

        // db에 데이터 저장
        await Champion.create({
          version: latestVersion,
          champKey: champKey,
          name: champKoName,
          champ_img: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
        });
      } else {
        console.log("데이터가 이미 존재함");
      }
    }

    // 성공
    res.status(200).json({ message: `챔피언 정보 업데이트 완료 ` });
  } catch (error) {
    console.log("error update champ", error);
    res
      .status(500)
      .json({ message: "챔피언 정보 업데이트 실패", error: error.message });
  }
};

// 프로필 업데이트 함수
const profileUpdate = async (req, res) => {
  try {
    // API 요청 보내기 [ 버전 ]
    const { data: versions } = await axios.get(
      "https://ddragon.leagueoflegends.com/api/versions.json"
    );
    const lastVersion = versions[0];

    // 프로필 정보 가져오기
    const { data: profileData } = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${lastVersion}/data/ko_KR/profileicon.json`
    );
    const profiles = Object.values(profileData.data);

    // file url 추출
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // 폴더 들어갈 경로
    const baseDir = path.join(__dirname, "..", "static", "profile_img");

    try {
      // profile_img 폴더가 없으면 생성
      await fs.access(baseDir);
      console.log("profile_img 폴더 존재");
    } catch (err) {
      await fs.mkdir(baseDir, { recursive: true });
      console.log("profile_img 폴더가 생성되었습니다.");
    }

    // 폴더 이미지 다운 및 s3 업로드
    for (const profile of profiles) {
      const profileKey = profile.id;
      const profileImgUrl = `https://ddragon.leagueoflegends.com/cdn/${lastVersion}/img/profileicon/${profileKey}.png`;
      const localFilePath = path.resolve(baseDir, `${profileKey}.png`);

      if (await fileExists(localFilePath)) {
        console.log(`이미 존재하는 파일: ${profileKey}.png - 다운로드 건너뜀`);
        continue;
      }

      console.log(`${profileKey} 이미지 다운로드 중...`);

      // 이미지 다운
      const { data: imageStream } = await axios.get(profileImgUrl, {
        responseType: "arraybuffer",
      });
      await fs.writeFile(localFilePath, imageStream);

      // db 데이터 유무 확인
      const existProfile = await Profile.findOne({
        where: { Profile_key: profileKey },
      });

      if (!existProfile) {
        // 데이터가 없으면 insert
        // db에 데이터 저장
        // s3 업로드
        const s3Key = `profile/${profileKey}.png`;
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
            Body: imageStream,
            ContentType: "image/png",
          })
        );

        await Profile.create({
          Profile_key: profileKey,
          Profile_img: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
        });
      } else {
        console.log("프로필 데이터가 존재합니다.");
      }
    }
    // 성공
    res.status(200).json({ message: `프로필 정보 업데이트 완료 ` });
  } catch (error) {
    console.log("profile update faile", error);
    res
      .status(500)
      .json({ message: "프로필 정보 업데이트 실패 ", error: error.message });
  }
};

export { ChampionUpdate, profileUpdate };
