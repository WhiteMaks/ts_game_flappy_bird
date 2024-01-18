export const textureVertexShaderCode =
	"#version 300 es\n" +
	"\n" +
	"layout (location = 0) in vec4 position;\n" +
	"layout (location = 1) in vec2 texCoord;\n" +
	"\n" +
	"out vec2 v_TexCoord;\n" +
	"\n" +
	"uniform mat4 u_ViewProjectionMatrix;\n" +
	"uniform mat4 u_WorldMatrix;\n" +
	"\n" +
	"void main() {\n" +
	"    v_TexCoord = vec2(texCoord.x, 1.0f - texCoord.y);\n" +
	"    gl_Position = u_ViewProjectionMatrix * u_WorldMatrix * position;\n" +
	"}"
;

export const textureFragmentShaderCode =
	"#version 300 es\n" +
	"\n" +
	"precision lowp float; //модификатор точности для фрагментного шейдера\n" +
	"\n" +
	"in vec2 v_TexCoord;\n" +
	"\n" +
	"uniform sampler2D u_Texture;\n" +
	"uniform vec4 u_Color;\n" +
	"\n" +
	"out vec4 fragColor; //выходная переменная итогового цвета\n" +
	"\n" +
	"void main() {\n" +
	"    vec4 textColor = texture(u_Texture, v_TexCoord) * u_Color;\n" +
	"    fragColor = textColor;\n" +
	"}"
;