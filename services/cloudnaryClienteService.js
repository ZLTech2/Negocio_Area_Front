const CLOUDINARY_CLOUD_NAME = 'dzqt0re7t';
const CLOUDINARY_UPLOAD_PRESET = 'negocionaarea';

export async function uploadCloudinary(uri) {

  const formData = new FormData();

  formData.append('file', {
    uri,
    name: 'imagem.jpg',
    type: 'image/jpeg',
  });

  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Erro upload Cloudinary');
  }

  const data = await response.json();

  return data.secure_url;
}