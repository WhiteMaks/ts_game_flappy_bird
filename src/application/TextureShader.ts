export const textureVertexShaderCode =
	"#version 300 es\n" +
	"\n" +
	"layout (location = 0) in vec4 a_Position;\n" +
	"layout (location = 1) in vec4 a_Color;\n" +
	"layout (location = 2) in vec2 a_TextCoord;\n" +
	"layout (location = 3) in float a_TextIndex;\n" +
	"layout (location = 4) in vec3 a_Translate;\n" +
	"layout (location = 5) in vec3 a_Rotation;\n" +
	"layout (location = 6) in vec3 a_Scale;\n" +
	"\n" +
	"out vec2 v_TextCoord;\n" +
	"out float v_TextIndex;\n" +
	"out vec4 v_Color;\n" +
	"\n" +
	"uniform mat4 u_ViewProjectionMatrix;\n" +
	"\n" +
	"mat4 getWorldMatrix() {\n" +
	"    mat4 translationMatrix = mat4(1.0);\n" +
	"    translationMatrix[3] = vec4(a_Translate, 1.0);\n" +
	"\n" +
	"    mat4 rotationMatrixZ = mat4(\n" +
	"        cos(a_Rotation.z), -sin(a_Rotation.z), 0.0, 0.0,\n" +
	"        sin(a_Rotation.z), cos(a_Rotation.z), 0.0, 0.0,\n" +
	"        0.0, 0.0, 1.0, 0.0,\n" +
	"        0.0, 0.0, 0.0, 1.0\n" +
	"    );" +
	"\n" +
	"    mat4 scaleMatrix = mat4(\n" +
	"        a_Scale.x, 0.0, 0.0, 0.0,\n" +
	"        0.0, a_Scale.y, 0.0, 0.0,\n" +
	"        0.0, 0.0, a_Scale.z, 0.0,\n" +
	"        0.0, 0.0, 0.0, 1.0\n" +
	"    );\n" +
	"\n" +
	"    return translationMatrix * rotationMatrixZ * scaleMatrix;\n" +
	"}" +
	"\n" +
	"void main() {\n" +
	"    v_TextCoord = vec2(a_TextCoord.x, 1.0f - a_TextCoord.y);\n" +
	"    v_TextIndex = a_TextIndex;\n" +
	"    v_Color = a_Color;\n" +
	"    mat4 worldMatrix = getWorldMatrix();\n" +
	"    gl_Position = u_ViewProjectionMatrix * worldMatrix * a_Position;\n" +
	"}"
;

export const textureFragmentShaderCode =
	"#version 300 es\n" +
	"\n" +
	"precision lowp float; //модификатор точности для фрагментного шейдера\n" +
	"\n" +
	"in vec2 v_TextCoord;\n" +
	"in float v_TextIndex;\n" +
	"in vec4 v_Color;\n" +
	"\n" +
	"uniform sampler2D u_Textures[16];\n" +
	"\n" +
	"out vec4 fragColor; //выходная переменная итогового цвета\n" +
	"\n" +
	"void main() {\n" +
	"    vec4 textColor = v_Color;\n" +
	"\n" +
	"    int index = int(v_TextIndex);\n" +
	"    switch (index) {\n" +
	"        case 0:\n" +
	"            textColor = textColor * texture(u_Textures[0], v_TextCoord);\n" +
	"            break;\n" +
	"        case 1:\n" +
	"            textColor = textColor * texture(u_Textures[1], v_TextCoord);\n" +
	"            break;\n" +
	"        case 2:\n" +
	"            textColor = textColor * texture(u_Textures[2], v_TextCoord);\n" +
	"            break;\n" +
	"        case 3:\n" +
	"            textColor = textColor * texture(u_Textures[3], v_TextCoord);\n" +
	"            break;\n" +
	"        case 4:\n" +
	"            textColor = textColor * texture(u_Textures[4], v_TextCoord);\n" +
	"            break;\n" +
	"        case 5:\n" +
	"            textColor = textColor * texture(u_Textures[5], v_TextCoord);\n" +
	"            break;\n" +
	"        case 6:\n" +
	"            textColor = textColor * texture(u_Textures[6], v_TextCoord);\n" +
	"            break;\n" +
	"        case 7:\n" +
	"            textColor = textColor * texture(u_Textures[7], v_TextCoord);\n" +
	"            break;\n" +
	"        case 8:\n" +
	"            textColor = textColor * texture(u_Textures[8], v_TextCoord);\n" +
	"            break;\n" +
	"        case 9:\n" +
	"            textColor = textColor * texture(u_Textures[9], v_TextCoord);\n" +
	"            break;\n" +
	"        case 10:\n" +
	"            textColor = textColor * texture(u_Textures[10], v_TextCoord);\n" +
	"            break;\n" +
	"        case 11:\n" +
	"            textColor = textColor * texture(u_Textures[11], v_TextCoord);\n" +
	"            break;\n" +
	"        case 12:\n" +
	"            textColor = textColor * texture(u_Textures[12], v_TextCoord);\n" +
	"            break;\n" +
	"        case 13:\n" +
	"            textColor = textColor * texture(u_Textures[13], v_TextCoord);\n" +
	"            break;\n" +
	"        case 14:\n" +
	"            textColor = textColor * texture(u_Textures[14], v_TextCoord);\n" +
	"            break;\n" +
	"        case 15:\n" +
	"            textColor = textColor * texture(u_Textures[15], v_TextCoord);\n" +
	"            break;\n" +
	"    };\n" +
	"    fragColor = textColor;\n" +
	"}"
;